import React, { useEffect, useState, useMemo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import http from './Http';
import CustomPagination from './core/CustomPagination';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap'; // or wherever you are importing Button from
import { headerConfig } from '../services/config';
 
 
const AuditTrail = () => {
  const [roleAssignments, setRoleAssignments] = useState([]);
  const [getResponse, setResponse] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [actionsData, setActionsData] = useState([]);
  const [searchedData, setSearchData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to show per page
  const [errorMessage, setErrorMessage] = useState('');
 
 
   
 
 
  // Handle pagination change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const navigate = useNavigate();
 
  const updateSearchObject = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchedData,
      [name]: value
    });
  }
  const today = new Date().toISOString().split('T')[0];
 
  const fetchRoleAssignments = async () => {
    try {
      setSearchData(null);
      const response = await http.get("Audit/GetAuditTrails");
      setResponse(response.data.item1 || []);
      const columnNames = [...new Set(response.data.item1.filter(item => item.components !== null).map(item => item.components))];
      setMasterData(columnNames)
 
    } catch (error) {
      console.error('Error fetching role assignments:', error.response ? error.response.data : error.message);
    }
  };
  useEffect(() => {
    // Actions
    if (searchedData) {
      const actions = [...new Set(getResponse.filter(item => item.actions !== null && item.components == searchedData?.components).map(item => item.actions))];
      setActionsData(actions)
    } else {
      setRoleAssignments([]);
 
    }
 
  }, [searchedData])
 
  const [headers, setHeaders] = useState([]);
  const submitRole = async () => {
    try {
      // console.log(getResponse)
      console.log(searchedData)
      console.log(getHeadersFromConfig());
      const matchedHeaders = getHeadersFromConfig();
      setHeaders(matchedHeaders);
      // Ensure filtering is done with proper dates
      const filteredData = filterArrayOfObjects(getResponse, searchedData);
      console.log("filteredData ", filteredData)
      setRoleAssignments(filteredData);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Error',
        text: 'Failed to assign role. Please check the input and try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
        cancelButtonText: 'Close',
        showCancelButton: true,
        reverseButtons: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }
  };
 
  // Handle sorting when clicking on column headers
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
 
  // Sorting logic based on sortConfig
  const sortedItems = useMemo(() => {
    let sortedData = [...roleAssignments];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  }, [roleAssignments, sortConfig]);
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  console.log("currentItems ", currentItems);
  const filterArrayOfObjects = (array, filterObject) => {
    let filteredRecords = array.filter(item => {
      // Convert createdDate from array to a Date object
      const itemDate = new Date(item.createdDate);
 
      // If startDate and endDate are defined, convert them to Date objects
      if (filterObject.startDate && filterObject.endDate) {
        const startDate = new Date(filterObject.startDate);
        const endDate = new Date(filterObject.endDate);
 
        // Set startDate to the beginning of the day (00:00:00)
        startDate.setHours(0, 0, 0, 0);
 
        // Set endDate to the end of the day (23:59:59.999)
        endDate.setHours(23, 59, 59, 999);
 
        // Check if item matches the filter criteria, including the date range
        return (
          item.components === filterObject.components &&
          item.actions === filterObject.actions &&
          itemDate >= startDate &&
          itemDate <= endDate
        );
      } else {
        // If no date range is provided, just filter by components and actions
        return (
          item.components === filterObject.components &&
          item.actions === filterObject.actions
        );
      }
    });
 
    // Sort the filtered array by 'createdDate' in descending order
    filteredRecords.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    return filteredRecords;
  };
 
  const getHeadersFromConfig = () => {
    // Find the configuration that matches the `searchedObject`
    const match = headerConfig.find(
      config =>
        config.components === searchedData.components &&
        config.actions === searchedData.actions
    );
 
    // If a match is found, return the headers, otherwise return a default set of headers
    return match ? match.headers : ['S.No', 'Components', 'Actions', 'Comments', 'Date & Time']; // Default fallback
  };
 
 
 
 
  useEffect(() => {
    fetchRoleAssignments();
  }, []);
 
  const handleDateChange = (e, key) => {
    const newValue = e.target.value;
 
    if (key === "endDate" && newValue < searchedData.startDate) {
      setErrorMessage('End Date cannot be less than Start Date');
    } else {
      setErrorMessage(''); // Clear error if valid
    }
    setSearchData({
      ...searchedData,
      [key]: newValue
    });
  };
 
  const handlePrint = () => {
    // Create a hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
 
    // Get iframe document
    const iframeDoc = iframe.contentWindow.document;
 
    // Create CSS styles to be included in the iframe
    const printStyles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .table th {
          background-color: #463E96;
          color: white;
        }
        @media print {
          @page {
            size: A4 landscape; /* Change to landscape to increase width */
            margin: 10mm;
          }
          body {
            margin: 0;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          .table th, .table td {
            page-break-inside: avoid;
          }
        }
      </style>
    `;
 
    // Write content to the iframe document
    iframeDoc.open();
    iframeDoc.write("<html><head><title>Print</title>");
    iframeDoc.write(printStyles); // Inject CSS styles
    iframeDoc.write("</head><body>");
    iframeDoc.write("<h1>Audit Trail Report</h1>");
 
    // Add table headers
    iframeDoc.write(`
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="text-center">S.No</th>
            <th class="text-center">Components</th>
            <th class="text-center">Actions</th>
            <th class="text-center">User ID</th>
            <th class="text-center">Created By</th>
            <th class="text-center">Comments</th>
            <th class="text-center">DateTime</th>
          </tr>
        </thead>
        <tbody>
    `);
 
    // Populate table rows with roleAssignments data
    roleAssignments.forEach((assignment, index) => {
      iframeDoc.write("<tr>");
      iframeDoc.write(`<td class="text-center">${index + 1}</td>`);
      iframeDoc.write(`<td class="text-center">${assignment.components || "NULL"}</td>`);
      iframeDoc.write(`<td class="text-center">${assignment.actions || "NULL"}</td>`);
      iframeDoc.write(`<td class="text-center">${assignment.name || "NULL"}</td>`);
      iframeDoc.write(`<td class="text-center">${assignment.createdBy || "NULL"}</td>`);
      iframeDoc.write(`<td class="text-center">${assignment.modifiedBy || "NULL"}</td>`);
      iframeDoc.write(`<td class="text-center">${assignment.reason || "NULL"}</td>`);
      iframeDoc.write(`<td class="text-center">${assignment.createdDate || "NULL"}</td>`);
      iframeDoc.write("</tr>");
    });
 
    iframeDoc.write("</tbody></table>");
    iframeDoc.write("</body></html>");
    iframeDoc.close();
 
    // Print the iframe content
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
 
    // Remove iframe after printing
    document.body.removeChild(iframe);
  };
 
 
  // CSV data for download
  const csvData = [
    ['S.No', 'Components', 'Actions', 'User id', 'Comments', 'DateTime'],
    ...roleAssignments.map((assignment, index) => [
      index + 1,
      assignment.components,
      assignment.actions,
      assignment.name,
      assignment.reason,
      assignment.createdDate,
    ]),
  ];
 
  const renderTableRows = () => {
    return currentItems.map((assignment, index) => (
      <tr key={assignment.id}>
        <td>{index + 1}</td>
        {headers.map((header, headerIndex) => {
          // Dynamically map each header to the corresponding assignment property
          switch (header.toLowerCase()) {
            case 'components':
              return <td key={headerIndex}>{assignment.components}</td>;
            case 'actions':
              return <td key={headerIndex}>{assignment.actions}</td>;
            case 'comments':
              return <td key={headerIndex}>{assignment.reason}</td>;
            case 'date & time':
              return <td key={headerIndex}>{assignment.createdDate}</td>;
            case 'user id':
              return <td key={headerIndex}>{assignment.referenceId}</td>;
            case 'user name':
              return <td key={headerIndex}>{assignment.name}</td>;
            case 'formula name':
              return <td key={headerIndex}>{assignment.name}</td>;
            case 'batch id':
              return <td key={headerIndex}>{assignment.batchID}</td>;
            case 'created by':
              return <td key={headerIndex}>{assignment.createdBy}</td>;
            case 'saved by':
              return <td key={headerIndex}>{assignment.createdBy}</td>;
            case 'modified by':
              return <td key={headerIndex}>{assignment.createdBy}</td>;
            case 'generated by':
              return <td key={headerIndex}>{assignment.createdBy}</td>;
            case 'reviewed by':
              return <td key={headerIndex}>{assignment.modifiedBy}</td>;
            case 'rejected by':
              return <td key={headerIndex}>{assignment.modifiedBy}</td>;
            case 'approved by':
              return <td key={headerIndex}>{assignment.modifiedBy}</td>;
            case 'group name':
              return <td key={headerIndex}>{assignment.groupValue}</td>;
            case 'old value':
              return <td key={headerIndex}>{assignment.oldValue}</td>;
            case 'new value':
              return <td key={headerIndex}>{assignment.newValue}</td>;
            default:
              return <td key={headerIndex}>N/A</td>; // Default if unknown header
          }
        })}
      </tr>
    ));
  };
 
 
 
  return (
    <section className="full_screen">
      <div className="container-fluid" style={{ padding: "30px" }}>
        <Row>
          <h6>Audit Trail Search</h6>
        </Row>
        <Row className='mt-3'>
          <Col sm={3}>
            <Form.Label>Masters <span style={{ color: 'red' }}>*</span></Form.Label>
            <select
              className="form-control1"
              name="components"
              value={searchedData ? searchedData.components : ''}
              onChange={updateSearchObject}
            >
              <option value="" disabled>
                --Select Master--
              </option>
              {masterData.map((each, i) => (
                <option key={i} value={each}>
                  {each}
                </option>
              ))}
            </select>
          </Col>
          <Col sm={3}>
            <Form.Label>Actions <span style={{ color: 'red' }}>*</span></Form.Label>
            <select
              className="form-control1"
              name="actions"
              value={searchedData ? searchedData.actions : ''}
              onChange={updateSearchObject}
              disabled={!searchedData?.components}
            >
              <option value=""  >
                --Select Actions--
              </option>
              {actionsData.map((each, i) => (
                <option key={i} value={each}>
                  {each}
                </option>
              ))}
            </select>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="startDate">
              <Form.Label>From Date <span style={{ color: 'red' }}>*</span></Form.Label>
              <input
                type="date"
                className="form-control1"
                value={searchedData ? searchedData.startDate : ''}
                max={today}
                onChange={(e) => handleDateChange(e, 'startDate')}
              />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="endDate">
              <Form.Label>To Date</Form.Label>
              <input
                type="date"
                className="form-control1"
                value={searchedData ? searchedData.endDate : ''}
                // min={searchedData?.startDate || ''}
                max={today}
                onChange={(e) => handleDateChange(e, "endDate")}
                disabled={!searchedData?.startDate}
              />
              {errorMessage && <div className="text-danger">{errorMessage}</div>}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <button
              id="submit-btn"
              className="btn btn-primary mt-4"
              onClick={submitRole}
              disabled={
                (!searchedData?.components) ||
                (searchedData?.startDate && !searchedData?.endDate) ||
                (!searchedData?.startDate && searchedData?.endDate)
 
                // || !searchedData?.startDate || !searchedData?.endDate
              }
            >
              Search
            </button>
            <button
              id="clear-btn"
              className="btn btn-primary mt-4 ms-3"
              onClick={() => {
                setSearchData(null);
              }}
              disabled={!searchedData}
            >
              Clear Search
            </button>
          </Col>
        </Row>
        <Row>
 
          {(searchedData && roleAssignments.length > 0) ?
 
            <Col sm={12}>
              <h6 className="mt-5">Audit Details</h6>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
 
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        onClick={() => handleSort(header.toLowerCase())}
                        style={{ cursor: 'pointer' }}
                      >
                        {header}
                        {sortConfig.key === header.toLowerCase() && (
                          sortConfig.direction === 'asc' ? ' ↑' : ' ↓')
                        }
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 && searchedData ? (
                    // currentItems.map((assignment, index) => (
                    //   <tr key={index}>
                    //     <td>{index + 1}</td>
                    //     <td>{assignment.components}</td>
                    //     <td>{assignment.actions}</td>
                    //     <td>{assignment.name}</td>
                    //     <td>{assignment.createdBy}</td>
                    //     {/* <td>{assignment.modifiedBy}</td>
                    //     <td>{assignment.reason}</td> */}
                    //     <td>{assignment.createdDate}</td>
                    //   </tr>
                    // ))
                    renderTableRows()
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No role assignments found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
 
              <CustomPagination
                itemsPerPage={itemsPerPage}
                totalItems={roleAssignments.length}
                paginate={paginate}
                currentPage={currentPage}
                style={{ display: 'flex', float: 'right' }}
              />
 
            </Col>
            : null}
        </Row>
        <div
          className="d-flex justify-content-end align-items-center my-3"
          style={{ marginRight: "20px" }}
        >
          <Row>
            <Col sm={12}>
              <Button
                variant="success"
                onClick={handlePrint}
                className="mt-4"
                style={{ marginRight: '10px' }}
              >
                Export to PDF
              </Button>
              <CSVLink data={csvData} filename={'audit_trail_report.csv'}>
                <Button variant="info" className="mt-4">
                  Export to CSV
                </Button>
              </CSVLink>
 
            </Col>
          </Row>
        </div>
 
 
      </div>
    </section>
  );
};
 
export default AuditTrail;
 
 