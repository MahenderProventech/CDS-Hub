import React, { useEffect, useState, useMemo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import http from './Http';
import CustomPagination from './core/CustomPagination';
import './Column_Dashboard.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap'; // or wherever you are importing Button from

 
const AuditTrail = () => {
  const [roleAssignments, setRoleAssignments] = useState([]);
  const [getResponse, setResponse] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [actionsData, setActionsData] = useState([]);
  const [nameData, setNameData] = useState([]);
  const [searchedData, setSearchData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to show per page
  const [loading, setLoading] = useState(true);

 
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
    finally {
      setLoading(false); // Hide loader after data is fetched
    }
  };
  useEffect(() => {
    // Actions
    if (searchedData) {
      const name= [...new Set(getResponse.filter(item => item.name !== null && item.components == searchedData?.components).map(item => item.name))];
      setNameData(name)
    } else {
      setRoleAssignments([]);
 
    }
 
  }, [searchedData])
  const submitRole = async () => {
    try {
      const filteredData = filterArrayOfObjects(getResponse, searchedData);
  
      // Sort by `createdDate` in descending order
      const sortedData = filteredData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      
      setRoleAssignments(sortedData);
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
        allowEscapeKey: false,
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
 
  const filterArrayOfObjects = (array, filterObject) => {
    console.log(array)
    console.log(filterObject)
    return array.filter(item => {
      for (const [key, value] of Object.entries(filterObject)) {
        // Convert the item's date string to a date object for comparison
        // if (key === "createdOn") {
        //   const itemDate = new Date(item[key]);
        //   const filterDate = new Date(value);
        //   // Compare only the date parts (without time)
        //   if (itemDate.toISOString().slice(0, 10) !== filterDate.toISOString().slice(0, 10)) {
        //     return false;
        //   }
        // }
        if (key === "startDate" || key === "endDate") {
          const itemDate = new Date(item["createdOn"]);
          const filterDate = new Date(value);
          // Adjust the comparison based on whether it's startDate or endDate
          if (key === "startDate" && itemDate < filterDate) {
            return false;
          }
          if (key === "endDate" && itemDate > filterDate) {
            return false;
          }
        }
        else {
          // Skip comparing properties with null values in the filter object
          if (value !== null && (!item.hasOwnProperty(key) || item[key] !== value)) {
            return false;
          }
        }
      }
      // All non-null key-value pairs in the filter object match the corresponding properties in the item
      return true;
    });
  };
 
  useEffect(() => {
    fetchRoleAssignments();
  }, []);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(null);
 
  const handleDateChange = (date, key) => {
    console.log(date.target.value);
    setSearchData({
      ...searchedData,
      [key]: date.target.value
    });
    // setStartDate(date.target.value);
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

 
  return (
    <section className="full_screen">
      {loading && (
      <div className="page-loader">
        <div className="loading-dots">
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
        </div>
      </div>
    )}
      <div className="container-fluid" style={{ padding: "30px" }}>
        <Row>
          <h6>Audit Trail Search</h6>
        </Row>
        <Row>
        
          <Col sm={3}>
 
            <Form.Label>Categories</Form.Label>
 
            <select
              className="form-control1"
              name="components"
              value={searchedData ? searchedData.components : ''}
              onChange={updateSearchObject}
            >
              <option value="" disabled selected> --Select Category--  </option>
              {masterData.map((each, i) => (
                <option key={i} value={each}>
                  {each}
                </option>
              ))}
            </select>
 
          </Col>
          <Col sm={3}>
            <Form.Label>UserID</Form.Label>
 
            <select
              className="form-control1"
              name="name"
              value={searchedData ? searchedData.name : ''}
              onChange={updateSearchObject}
              //disabled={!searchedData?.name}
            >
              <option value="" disabled selected>
                --Select UserID--            </option>
              {nameData.map((each, i) => (
                <option key={i} value={each}>
                  {each}
                </option>
              ))}
            </select>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="startDate">
              <Form.Label>From Date</Form.Label>
              <input type="date" className='form-control1'
                value={searchedData ? searchedData.startDate : ''}
                onChange={(e) => handleDateChange(e, "startDate")} />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group controlId="endDate">
              <Form.Label>To Date</Form.Label>
              <input type="date"  className='form-control1'
                value={searchedData ? searchedData.endDate : ''}
                onChange={(e) => handleDateChange(e, "endDate")} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
          <button
  id="submit-btn"
  className="btn btn-primary mt-4"
  onClick={submitRole}
  disabled={!searchedData}
  style={{ backgroundColor: '#463E96', borderColor: '#463E96' }}
>
  Search
</button>
<button
  id="submit-btn"
  className="btn btn-primary mt-4 ms-3"
  onClick={() => { setSearchData(null); }}
  disabled={!searchedData}
  style={{ backgroundColor: '#463E96', borderColor: '#463E96' }}
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
                    <th>S.No</th>
                    <th onClick={() => handleSort('components')} style={{ cursor: 'pointer' }}>
                     Components {sortConfig.key === 'components' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                     User id {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }} hidden>
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('createdBy')} style={{ cursor: 'pointer' }}hidden>
                      Created By {sortConfig.key === 'createdBy' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('reason')} style={{ cursor: 'pointer' }}>
                      Comments {sortConfig.key === 'reason' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('dateTime')} style={{ cursor: 'pointer' }}>
                      DateTime {sortConfig.key === 'dateTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
 
                </thead>
                <tbody>
 
                  {currentItems.length > 0 && searchedData ? (
                    currentItems.map((assignment, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{assignment.components}</td>
                        <td>{assignment.actions}</td>
                            <td>{assignment.name}</td>
                        <td hidden>{assignment.name}</td>
                        <td hidden>{assignment.createdBy}</td>
                        <td>{assignment.reason}</td>
                        <td>{assignment.createdDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">No role assignments found</td>
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
 
 