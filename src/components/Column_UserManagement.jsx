import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import { Link, useNavigate } from 'react-router-dom';
import po from '../img/po.svg';

 
// Define any necessary functions or state here
import React, { useEffect, useState, useMemo ,useContext} from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { IoPencil, IoArchiveSharp } from 'react-icons/io5';
  import CustomPagination from './core/CustomPagination';
  import http from './Http';
  import * as Appconstant from '../services/AppConstantService';
  import MultiSelectComponent from './core/MultiSelectComponent';
  import "./Column_Dashboard.css";
  import UserContext from './UserContext';



const Column_UserManagement = () => {
    const [show, setShow] = useState(false);
    const [deptResponse, setDeptResponse] = useState([]);
    const [groupResponse, setGroupResponse] = useState([]);
    const [plantResponse, setPlantResponse] = useState([]);
  
    const [getDesignationResponse, setGetDesignationResponse] = useState([]);
    const [getRolesResponse, setGetRolesResponse] = useState([]);
    const [archiveduser, setArchivedUser] = useState(null);
    const [errors, setErrors] = useState({
      passwordError: '',
      confirmPasswordError: ''
    });
  
    const [isEdit, isEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [roleAssignments, setRoleAssignments] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items to show per page
    const [loading, setLoading] = useState(true);
    const { userData } = useContext(UserContext);
  
    // Handle pagination change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    const navigate = useNavigate();
  

   

    // Fetch initial data
    useEffect(() => {
      fetchAllUsers();
      fetConfigurations();
    }, []);
    const fetConfigurations = async () => {
      try {
        const deptResponse = await axios.get(Appconstant.getDepartments);
        setDeptResponse(deptResponse.data.item2);
        const getDesignationResponse = await axios.get(Appconstant.getDesignation);
        setGetDesignationResponse(getDesignationResponse.data.item2);
        const plantResponse = await axios.get(Appconstant.getPlants);
        setPlantResponse(plantResponse.data.item2);
        const getGroupResponse = await axios.get(Appconstant.getGroups);
        setGroupResponse(getGroupResponse.data.item2);
        const getRolesResponse = await axios.get(Appconstant.getRoles);
        setGetRolesResponse(getRolesResponse.data.item2);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
      finally {
        setLoading(false); // Hide loader after data is fetched
      }
    }
    // Fetch all users from API
    const fetchAllUsers = () => {
      http.get(Appconstant.getAllUsers)
        .then((resp) => {
          setRoleAssignments(resp.data.item2);
        })
        .catch((err) => {
          console.log("Error fetching users:", err);
        });
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
  
  
    const handleLogout = () => {
      sessionStorage.clear();
      http.get(`Login/Logout?employeeId=${userData.employeeId}`);
      navigate('/');
    };
  
    // Handle search input change
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1); // Reset pagination to first page when searching
    };
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  
    // Filter items based on search query
    const filteredItems = currentItems.filter((assignment) =>
      assignment.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.userRole.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Format date function
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString([], { hour12: false })}`;
    };
  
    // Show alert function
    const showAlert = (msg) => {
      Swal.fire({
        title: '',
        text: msg,
        icon: 'info',
        confirmButtonText: 'Ok',
        cancelButtonText: 'Close',
        showCancelButton: true,
        reverseButtons: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/home/userList");
        }
      });
    };
  
    // Handle form data change
    const handleFormData = (e) => {
      const { name, value } = e.target;
      setSelectedUser({
        ...selectedUser,
        [name]: value
      });
    };
  
    // Handle form data change for dropdowns
    const handleFormDataDropdown = (e, key) => {
      setSelectedUser({
        ...selectedUser,
        [key]: e.label
      });
    };
  
    // Submit user form
    const SubmitUserForm = async () => {
      console.log(selectedRolesOptions);
      console.log(selectedPlantsOptions)
  
      // selectedUser['userConfigurations'] = userConfigurations;
      // or
      selectedUser['userRoles'] = selectedRolesOptions;
      selectedUser['userPlants'] = selectedPlantsOptions;
      selectedUser['userGroups'] = selectedGroupOptions;
      if (!isEdit) {
        const passwordError = validatePassword();
        if (passwordError) {
          setErrors({ passwordError });
          return;
        }
  
        if (selectedUser.password !== selectedUser.confirmPassword) {
          setErrors({
            ...errors,
            confirmPasswordError: "Passwords do not match."
          });
          return;
        }
      }
      // delete selectedUser.userConfigurations;
      console.log(selectedUser)
  
      try {
        const response = await http.post(Appconstant.submitUserForm, selectedUser);
        if (response) {
          showAlert('User Saved Successfully.');
          fetchAllUsers();
          setShowModal(false);
          setSelectedRolesOptions([]);
          setSelectedPlantsOptions([]);
          setSelectedGroupOptions([]);
        }
      } catch (error) {
        // Handle error
      }
    };
    const validatePassword = () => {
      const { password } = selectedUser;
      let passwordError = '';
  
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
  
      if (!strongRegex.test(password)) {
        passwordError = `Password must be alphanumeric with at least one uppercase letter, 
        one special character, 
        and minimum 8 characters long.`;
      }
  
      return passwordError;
    };
    const handleClose = () => {
      setShowModal(false);
      setSelectedUser([]);
      setSelectedPlantsOptions([]);
      setSelectedGroupOptions([]);
      setSelectedRolesOptions([]);
    }
  
    // Show modal
    const handleShowModal = async () => {
      setShowModal(true);
      isEditMode(false);
      setSelectedUser([]);
      setSelectedPlantsOptions([]);
      setSelectedGroupOptions([]);
      setSelectedRolesOptions([]);
    };
  
    // Get user data for editing
    const getUserData = (data) => {
      console.log(data)
      setSelectedUser(data);
      setSelectedPlantsOptions(data.userPlants);
      setSelectedGroupOptions(data.userGroups);
      setSelectedRolesOptions(data.userRoles);
      isEditMode(true);
      setShowModal(true);
    };
  
    // Show archive modal
    const handleShowArchiveModal = (data) => {
      setShow(true);
      isEditMode(false);
      setArchivedUser({
        ...archiveduser,
        employeeId: data.employeeId
      });
    };
  
    // Close archive modal
    const handleCloseArchiveModal = () => setShow(false);
    // const handleCloseArchieveModal = () => setShow(false);
  
    // Archive user
    const handleArchiveUser = async () => {
      try {
        const deptResponse = await axios.post(Appconstant.UpdateUserStatus, archiveduser);
        if (deptResponse) {
          showAlert('User Archived.');
          fetchAllUsers();
          handleCloseArchiveModal();
        }
      } catch (error) {
        console.error("Error archiving user:", error);
      }
    };
    const [selectedRolesOptions, setSelectedRolesOptions] = useState([]);
    const [selectedPlantsOptions, setSelectedPlantsOptions] = useState([]);
    const [selectedGroupOptions, setSelectedGroupOptions] = useState([]);
  
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
            <Link to={"/home/Column_Dashboard1"}>
              <button type="button">
                <img src={dash} alt="Dashboard1" title="Dashboard1" />
                <p>Analysis</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_Dashboard"}>
              <button type="button">
                <img src={dash} alt="Dashboard" title="Dashboard" />
                <p>Dashboard</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/ColumnLog_List"}>
              <button type="button">
                <img src={HplcLogList} alt="Column Log List" title="Column Log List" />
                <p>Column Log List</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_Search"}>
              <button type="button">
                <img src={search} alt="Search" title="Search" />
                <p>Search</p>
              </button>
            </Link>
          </div><br />
          {/* <div className="btn-group dropend">
            <Link to={"/home/Column_AuditTrail"}>
              <button type="button">
                <img src={report} alt="Audit Trial" title="Audit Trial" />
                <p>Audit Trail</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_UserManagement"}>
              <button type="button">
                <img src={usermanagement} alt="User Management" title="User Management" />
                <p>User Management</p>
              </button>
            </Link>
          </div><br /> */}
          <div className="btn-group dropend" style={{ marginTop: "10px" }}>
                            <button type="button" title='Logout' onClick={handleLogout}>
                                <img src={po} alt="Logout" />
                            </button>
                    </div>
        </div>
      </aside>
          <section className="full_screen">
      <div style={{ padding: "30px" }}>
        {/* <Row>
          <h6>Users:</h6>
        </Row> */}

        <Row className='mb-3'>
          <Col sm={9}>
            <h6>Users</h6>
          </Col>
          <Col sm={2}>
            <input
              type="text"
              placeholder="Search by User Details"
              value={searchQuery}
              onChange={handleSearchChange}
              className="formulaName"
              style={{ width: "300px", border: '1px solid', float: 'right' }}
            />
          </Col>
          <Col sm={1}>
            <button className='btn btn-primary' onClick={handleShowModal} style={{ marginRight: "15px" , backgroundColor: '#463E96', borderColor: '#463E96'}}  
            >
              Create
            </button>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            {/* <h6 className="mt-5">List of Users</h6> */}
            <Table striped bordered hover>
              <thead>
                <tr>

                  <th>#</th>
                  <th onClick={() => handleSort('employeeId')} style={{ cursor: 'pointer' }}>
                    User ID {sortConfig.key === 'employeeId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('emailId')} style={{ cursor: 'pointer' }}>
                    Email ID {sortConfig.key === 'emailId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('createdOn')} style={{ cursor: 'pointer' }}>
                    CreatedOn {sortConfig.key === 'createdOn' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('userRole')} style={{ cursor: 'pointer' }}>
                    Role {sortConfig.key === 'userRole' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('isActive')} style={{ cursor: 'pointer' }}>
                    Status {sortConfig.key === 'isActive' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((assignment, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{assignment.employeeId}</td>
                      <td>{assignment.emailId}</td>
                      <td>{formatDate(assignment.createdOn)}</td>
                      <td>{assignment.userRole}</td>
                      <td>{assignment.isActive ? 'Active' : 'Inactive'}</td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => getUserData(assignment)}>
                          <IoPencil />
                        </Button>{' '}
                        <Button variant="primary" size="sm" onClick={() => handleShowArchiveModal(assignment)}>
                          <IoArchiveSharp />
                        </Button>{' '}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No role assignments found
                    </td>
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
        </Row>

        <Modal show={showModal} onHide={handleClose} size='lg'>
          <Modal.Header closeButton >
            <Modal.Title>Create User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row w-100">
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label>
                      Employee ID
                    </Form.Label>
                    <Col>
                      <Form.Control type="text" placeholder="Employee ID" name="employeeId" value={selectedUser?.employeeId}
                        onChange={handleFormData} disabled={isEdit} />
                    </Col>
                  </Form.Group>
                </div>

                <div className="col-md-6 ">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label>
                      Email ID
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control type="email" placeholder="Email ID" name="emailId" value={selectedUser?.emailId}
                        onChange={handleFormData}
                      />
                    </Col>
                  </Form.Group>
                </div>
              </div>

              <div className="row w-100">
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column >
                      First Name
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control style={{ outline: "1px solid black" }} type="text" placeholder="First Name*" name="firstName" onChange={handleFormData} value={selectedUser?.firstName || ''}></Form.Control>
                    </Col>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column >
                      Last Name
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control style={{ outline: "1px solid black" }} type="text" placeholder="Last Name*" name="lastName" onChange={handleFormData} value={selectedUser?.lastName || ''}></Form.Control>
                    </Col>
                  </Form.Group>
                </div>
              </div>
              <div className="row w-100">
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label>
                      Role
                    </Form.Label>
                    <Col>

                      <MultiSelectComponent
                        options={getRolesResponse.map(option => ({
                          value: option.configureId, label: option.configureValue
                        }))}
                        placeholder="--Select--"
                        classNamePrefix="react-select"
                        className="react-select-container"
                        name="userRole"
                        setSelectedOptions={(data) => setSelectedRolesOptions(data)}
                        selectedOptions={selectedRolesOptions}
                      />
                    </Col>
                  </Form.Group>
                </div>
          
              <div className="col-md-6">
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label >
                      Department
                    </Form.Label>
                    <Col>
                      <Select
                        options={deptResponse.map(option => ({ value: option.configureId, label: option.configureValue }))}
                        placeholder="--Select--"
                        classNamePrefix="react-select"
                        className="react-select-container"
                        value={selectedUser?.department ? { value: selectedUser?.department, label: selectedUser?.department } : null}
                        name="department"
                        onChange={(e) => handleFormDataDropdown(e, "department")}
                      />
                    </Col>
                  </Form.Group>
                </div>
              </div>
              <div className="row w-100">
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label >
                      Plants
                    </Form.Label>
                    <Col>
                      <MultiSelectComponent
                        options={plantResponse.map(option => ({ value: option.configureId, label: option.configureValue, configureId: option.configureId }))}
                        placeholder="--Select--"
                        classNamePrefix="react-select"
                        className="react-select-container"
                        // value={selectedUser?.userRole ? { value: selectedUser?.userRole, label: selectedUser?.userRole } : null}
                        name="userRole"
                        setSelectedOptions={(data) => setSelectedPlantsOptions(data)}
                        selectedOptions={selectedPlantsOptions}
                      />

                    </Col>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label >
                      Groups
                    </Form.Label>
                    <Col>

                      <MultiSelectComponent
                        options={groupResponse.map(option => ({ value: option.configureId, label: option.configureValue }))}
                        placeholder="--Select--"
                        classNamePrefix="react-select"
                        className="react-select-container"
                        name="userRole"
                        setSelectedOptions={(data) => setSelectedGroupOptions(data)}
                        selectedOptions={selectedGroupOptions}
                      />
                    </Col>
                  </Form.Group>
                </div>
              </div>
              <div className="row w-100">
                <div className="col-md-6 mb-3">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label>
                      Designation
                    </Form.Label>
                    <Col>
                      <Select
                        options={getDesignationResponse.map(option => ({ value: option.configureId, label: option.configureValue }))}
                        placeholder="--Select--"
                        classNamePrefix="react-select"
                        className="react-select-container"
                        value={selectedUser?.designation ? { value: selectedUser?.designation, label: selectedUser?.designation } : null}
                        name="designation"
                        onChange={(e) => handleFormDataDropdown(e, "designation")}
                      />
                    </Col>
                  </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label>
                      Status
                    </Form.Label>
                    <Col>
                      <Form.Select name="isActive" value={selectedUser?.isActive} onChange={handleFormData}>
                        <option value={true}>Active</option>
                        <option value={false}>InActive</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </div>
              </div>


              {!isEdit &&
                <div className="row w-100">
                  <div className="col-md-6">
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                      <Form.Label >
                        Password
                      </Form.Label>
                      <Col>
                        <Form.Control type="password" placeholder="Password" name="password" value={selectedUser?.password} onChange={handleFormData} />
                        <Form.Text className="text-danger">{errors.passwordError}</Form.Text>
                      </Col>
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                      <Form.Label>
                        Confirm Password
                      </Form.Label>
                      <Col >
                        <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" value={selectedUser?.confirmPassword} onChange={handleFormData} />
                        <Form.Text className="text-danger">{errors.confirmPasswordError}</Form.Text>
                      </Col>
                    </Form.Group>
                  </div>
                </div>
      }



            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={SubmitUserForm}>
              Submit
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show} onHide={handleCloseArchiveModal}>
          <Modal.Header closeButton>
            <Modal.Title>Archive User</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body>Are you sure you want to archive this user?</Modal.Body> */}
          <Modal.Body>
            <Form.Group controlId="formEmail">
              <Form.Label>Employee ID/User ID*</Form.Label>
              <Form.Control type="text" placeholder="Enter your Employee ID/User ID" name="employeeId" value={archiveduser?.employeeId} readonly disabled />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reason</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(text) => {
                setArchivedUser({
                  ...archiveduser,
                  comments: text.target.value
                })
              }} />
            </Form.Group>

            {/* </Form> */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseArchiveModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleArchiveUser}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
    </div>
  );
};
 
export default Column_UserManagement;
 