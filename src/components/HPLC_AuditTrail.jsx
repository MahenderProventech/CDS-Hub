import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import http from './Http';
import CustomPagination from './core/CustomPagination';
import po from '../img/po.svg';
import './Column_Dashboard.css';


 
const HPLC_AuditTrail = () => {
  const [roleAssignments, setRoleAssignments] = useState([]);
  const [getResponse, setResponse] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [nameData, setNameData] = useState([]);
  const [actionsData, setActionsData] = useState([]);
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
      const name = [...new Set(getResponse.filter(item => item.name !== null && item.components == searchedData?.components).map(item => item.name))];
      setNameData(name)
    } else {
      setRoleAssignments([]);

    }

  }, [searchedData])
  const submitRole = async () => {
    try {
      const filteredData = filterArrayOfObjects(getResponse, searchedData);
      setRoleAssignments(filteredData);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Error',
        text: 'Failed to assign role. Pleas e check the input and try again.',
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
 
  return (
    <div>
       {loading && (
      <div className="page-loader">
        <div className="loading-dots">
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
        </div>
      </div>
    )}
        <aside className="col-md-1 p_sideNav">
        <div className="main">
        <div className="btn-group dropend">
            <Link to={"/home/HPLC_Dashboard1"}>
              <button type="button">
                <img src={dash} alt="HPLCDashboard1" title="HPLCDashboard1" />
                <p>Analysis</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Dashboard"}>
              <button type="button">
                <img src={dash} alt="HPLCDashboard" title="HPLCDashboard" />
                <p>Dashboard</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLCLog_List"}>
              <button type="button">
                <img src={HplcLogList} alt="HPLC Log List" title="HPLC Log List" />
                <p>HPLC Log List</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Search"}>
              <button type="button">
                <img src={search} alt="Search" title="Search" />
                <p>Search</p>
              </button>
            </Link>
          </div><br />
          {/* <div className="btn-group dropend">
            <Link to={"/home/HPLC_AuditTrail"}>
              <button type="button">
                <img src={report} alt="Audit Trial" title="Audit Trial" />
                <p>Audit Trail</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_UserManagement"}>
              <button type="button">
                <img src={usermanagement} alt="User Management" title="User Management" />
                <p>User Management</p>
              </button>
            </Link>
          </div><br /> */}
          <div className="btn-group dropend" style={{ marginTop: "200px" }}>
                        <Link to={"/"}>
                            <button type="button" title='Logout'>
                                <img src={po} alt="Logout" />
                            </button>
                        </Link>
                    </div>
        </div>
      </aside>

          <section className="full_screen">
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
            <Form.Label>UserID </Form.Label>

            <select
              className="form-control1"
              name="name"
              value={searchedData ? searchedData.name: ''}
              onChange={updateSearchObject}
              //disabled={!searchedData?.components}
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
                    <th>SNo</th>
                    <th>Actions</th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      UserID {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }} hidden>
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('createdBy')} style={{ cursor: 'pointer' }} hidden>
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
      </div>
    </section>
    </div>
  );
};
 
export default HPLC_AuditTrail;
 