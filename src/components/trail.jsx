import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { IoPencil, IoArchiveSharp } from 'react-icons/io5';
import CustomPagination from './core/CustomPagination';
import http from './Http';
import * as Appconstant from '../services/AppConstantService';
import MultiSelectComponent from './core/MultiSelectComponent';
import UserContext from './UserContext';
import './AuthModal.css';
const UserList = () => {
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
      console.log(getRolesResponse);
      setGetRolesResponse(getRolesResponse.data.item2);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
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
  // Memoized sorting
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
 
 
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset pagination to first page when searching
  };
 
  // Filter items based on search query
  const filteredItems = sortedItems.filter((assignment) => {
    const employeeId = (assignment.employeeId || '').toLowerCase();
    const emailId = (assignment.emailId || '').toLowerCase();
    const userRole = (assignment.userRole || '').toLowerCase();
    const query = searchQuery.toLowerCase();
 
    return employeeId.includes(query) ||
      emailId.includes(query) ||
      userRole.includes(query);
  });
 
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
 
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString([], { hour12: false })}`;
  };
  const { userData } = React.useContext(UserContext);
 
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
 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const handleShowAuthModal = () => {
    setShowAuthModal(true);
  };
 
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };
 
  const handleAuthSubmit = () => {
    setValidationMessage('');
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const comments = document.getElementById('auth-comments').value;
    console.log(password)
    if (!password) {
      setValidationMessage('Please enter password');
      return;
    }
 
    if (comments === '') {
      setValidationMessage('Please add comments');
      return;
    }
    if (username === userData.employeeId) {
      const payload = {
        LoginId: username,
        Password: password
      };
 
      http.post("/Login/AuthenticateData", payload)
        .then((resp) => {
          if (resp.data.item1) {
            SubmitUserForm(comments);
          } else {
            Swal.fire('Authentication failed', 'Please enter valid details', 'error');
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire('Authentication failed', 'Invalid username or password', 'error');
        });
    } else {
      Swal.fire('Authentication failed', 'Invalid username', 'error');
    }
 
    // Handle the authentication logic here
 
    handleCloseAuthModal(); // Close the auth modal after submission
  };
  return (
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
            <button className='btn btn-primary' onClick={handleShowModal} style={{ marginRight: "15px" }}>
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
                {currentItems.length > 0 ? (
                  currentItems.map((assignment, index) => (
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
 
        {/* Custom Authentication Modal */}
        <Modal show={showAuthModal} onHide={handleCloseAuthModal} className="auth-modal"
          backdrop="static" // Prevent closing on outside click
          keyboard={false} // Optional: Prevent closing with the Esc key
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'grey' }}>Authentication Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="auth-username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Username" value={userData.employeeId} readOnly />
              </Form.Group>
              <Form.Group controlId="auth-password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group controlId="auth-comments">
                <Form.Label>Comments</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Comments" />
              </Form.Group>
 
              {validationMessage && (
                <div className="text-danger mt-2">{validationMessage}</div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleAuthSubmit}>
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseAuthModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
 
 
        <Modal show={showModal} onHide={handleClose} size='lg'
          backdrop="static" // Prevent closing on outside click
          keyboard={false} // Optional: Prevent closing with the Esc key
        >
          <Modal.Header closeButton >
            <Modal.Title>{isEdit ? 'Edit User' : 'Create User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row w-100">
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label>
                      Employee ID <span className="text-danger">*</span>
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
                      Email ID <span className="text-danger">*</span>
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
                      First Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control style={{ outline: "1px solid black" }} type="text" placeholder="First Name" name="firstName" onChange={handleFormData} value={selectedUser?.firstName || ''}></Form.Control>
                    </Col>
                  </Form.Group>
                </div>
 
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column >
                      Last Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control style={{ outline: "1px solid black" }} type="text" placeholder="Last Name" name="lastName" onChange={handleFormData} value={selectedUser?.lastName || ''}></Form.Control>
                    </Col>
                  </Form.Group>
                </div>
              </div>
              <div className="row w-100">
                <div className="col-md-12">
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
              </div>
              <div className="row w-100">
                <div className="col-md-12">
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
                <div className="col-md-12">
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
              </div>
              <div className="row w-100">
                <div className="col-md-12">
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
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail" >
                    <Form.Label>
                      Status
                    </Form.Label>
                    <Col>
                      <Form.Select name="isActive" value={selectedUser?.isActive} onChange={handleFormData} disabled={!isEdit}>
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
            <Button variant="primary" onClick={handleShowAuthModal} disabled={!selectedUser?.firstName || !selectedUser?.lastName || !selectedUser?.employeeId || !selectedUser?.emailId}>
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
            <Button variant="primary" onClick={handleArchiveUser} disabled={!archiveduser?.comments}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
};
 
export default UserList;
 
 