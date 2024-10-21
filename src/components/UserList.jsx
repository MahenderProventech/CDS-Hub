import React, { useEffect, useState, useMemo,useContext } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoPencil, IoArchiveSharp } from 'react-icons/io5';
import CustomPagination from './core/CustomPagination';
import http from './Http';
import * as Appconstant from '../services/AppConstantService';
import MultiSelectComponent from './core/MultiSelectComponent';
import './Column_Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import UserContext from './UserContext';
 
const UserList = () => {
  const [show, setShow] = useState(false);
  const [deptResponse, setDeptResponse] = useState([]);
  const [groupResponse, setGroupResponse] = useState([]);
  const [plantResponse, setPlantResponse] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Controls modal visibility
  const [validationMessage, setValidationMessage] = useState('');

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
  const [apiSettings, setApiSettings] = useState({});
  const { userData } = useContext(UserContext); // Access logged-in user data from context
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
      const deptResponse = await http.get(Appconstant.getDepartments);
      setDeptResponse(deptResponse.data.item2);
      const getDesignationResponse = await http.get(Appconstant.getDesignation);
      setGetDesignationResponse(getDesignationResponse.data.item2);
      const plantResponse = await http.get(Appconstant.getPlants);
      setPlantResponse(plantResponse.data.item2);
      const getGroupResponse = await http.get(Appconstant.getGroups);
      setGroupResponse(getGroupResponse.data.item2);
      const getRolesResponse = await http.get(Appconstant.getRoles);
      setGetRolesResponse(getRolesResponse.data.item2);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
    finally {
      setLoading(false); // Hide loader after data is fetched
    }
  }
  // Fetch all users from API
  const fetchAllUsers = async () => {
    try {
      const resp = await http.get(Appconstant.getAllUsers);
      
      setRoleAssignments(resp.data.item2);
    } catch (err) {
      console.log("Error fetching users:", err);
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

  const checkEmployeeIdOrEmailExists = async (employeeId, emailId) => {
    try {
      const response = await http.get(Appconstant.getAllUsers);
      const existingUsers = response.data.item2;
  
      // Check if the employeeId or email already exists
      const isEmployeeIdExists = existingUsers.some(user => user.employeeId === employeeId);
      const isEmailExists = existingUsers.some(user => user.emailId === emailId);
  
      if (isEmployeeIdExists || isEmailExists) {
        return {
          isEmployeeIdExists,
          isEmailExists
        };
      }
      return {
        isEmployeeIdExists: false,
        isEmailExists: false
      };
    } catch (error) {
      console.error("Error checking employee ID or email:", error);
      return {
        isEmployeeIdExists: false,
        isEmailExists: false
      };
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    const mobileNoPattern = /^\d{10}$/; // Regular expression for 10 digits
  
    // Validate mobile number
    if (!mobileNoPattern.test(selectedUser.mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be exactly 10 digits.';
    }
  
    // Add other validations as needed
    const passwordValidation = validatePassword();
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.password;
      newErrors.confirmPassword = passwordValidation.errors.confirmPassword; 
    }
  
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };
  
  const [comments, setComments] = useState('');  // Initialize comments in state
  const handleCommentsChange = (e) => {
    setComments(e.target.value);  // Update comments based on input
  };
  // Submit user form
  const SubmitUserForm = async () => {
    console.log(selectedRolesOptions);
    console.log(selectedPlantsOptions);
  
    selectedUser['userRoles'] = selectedRolesOptions;
    selectedUser['userPlants'] = selectedPlantsOptions;
    selectedUser['userGroups'] = selectedGroupOptions;
    selectedUser.isActive = selectedUser.isActive === 'true' ? true : false;
    selectedUser.comments = comments;
    // Validate form fields
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      console.log("Validation Errors:", validationResult.errors);
      return; // Stop form submission if validation fails
    }
  
    // Check if the email or employee ID exists when creating a new user
    if (!isEdit) {
      const { isEmployeeIdExists, isEmailExists } = await checkEmployeeIdOrEmailExists(selectedUser.employeeId, selectedUser.emailId);
  
      if (isEmployeeIdExists) {
        showAlert('Employee ID already exists. Please use a different Employee ID.');
        return; // Stop form submission if employeeId exists
      }
  
      if (isEmailExists) {
        showAlert('Email ID already exists. Please use a different Email ID.');
        return; // Stop form submission if email exists
      }
  
      // If creating a new user, validate password
      const passwordValidationResult = validatePassword();
      if (!passwordValidationResult.isValid) {
        setErrors(passwordValidationResult.errors);
        console.log("Validation Errors:", passwordValidationResult.errors);
        return; // Stop form submission if password validation fails
      }
    }
  
    // In edit mode, validate password only if provided
    if (isEdit) {
      if (selectedUser.password || selectedUser.confirmPassword) {
        const passwordValidationResult = validatePassword();
        if (!passwordValidationResult.isValid) {
          setErrors(passwordValidationResult.errors);
          console.log("Password validation errors:", passwordValidationResult.errors);
          return; // Stop form submission if password validation fails
        }
  
        // If password fields are valid, update the password in the backend
      } else {
        // Remove password fields from the payload if both are empty
        delete selectedUser.password;
        delete selectedUser.confirmPassword;
      }
    }
  
    console.log("Selected values:", selectedUser);
  
    try {
      const response = await http.post(Appconstant.submitUserForm, selectedUser);
      if (response) {
        showAlert(isEdit ? 'User Updated Successfully.' : 'User Saved Successfully.');
        fetchAllUsers();
        setShowModal(false);
        setSelectedRolesOptions([]);
        setSelectedPlantsOptions([]);
        setSelectedGroupOptions([]);
        handleClose(); 
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  


 
 
  useEffect(() => {
    // Fetch API settings on component mount
    http.get("Settings/Savesettings")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setApiSettings(response.data[0]); // Assuming the API returns an array, take the first element
          console.log("API Settings fetched: ", response.data[0]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching settings:", error);
      });
  }, []);
 
 
  const validatePassword = () => {
    const { password = "", confirmPassword = "" } = selectedUser || {}; // Default to empty strings
    const newErrors = {};
  
    // Skip password validation if we're editing a user and no password is provided
    if (isEdit && (!password || password.trim() === "")) {
      return { isValid: true, errors: {} }; // If editing, no need to validate password
    }
  
    // Minimum password length check
    if (password.length < (apiSettings?.minPasswordLength || 8)) {
      newErrors.password = `Password must be at least ${apiSettings?.minPasswordLength || 8} characters long`;
    }
  
    // Uppercase check
    if (
      (apiSettings?.uppercaseRequired === true || apiSettings?.uppercaseRequired === 1) &&
      !/[A-Z]/.test(password)
    ) {
      newErrors.password = "Password must contain at least one uppercase letter";
    }
  
    // Lowercase check
    if (
      (apiSettings?.lowercaseRequired === true || apiSettings?.lowercaseRequired === 1) &&
      !/[a-z]/.test(password)
    ) {
      newErrors.password = "Password must contain at least one lowercase letter";
    }
  
    // Number check
    if (
      (apiSettings?.numberRequired === true || apiSettings?.numberRequired === 1) &&
      !/[0-9]/.test(password)
    ) {
      newErrors.password = "Password must contain at least one number";
    }
  
    // Symbols check
    if (
      (apiSettings?.symbolsRequired === true || apiSettings?.symbolsRequired === 1) &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      newErrors.password = "Password must contain at least one symbol";
    }
  
    // Password match check
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
  
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };
  
  const resetForm = () => {
    setSelectedUser({
      // Initialize with default values if necessary
      mobileNo: '',
      password: '',
      confirmPassword: '',
      // Add other fields as required
    });
    setErrors({
      mobileNo: '',
      password: '',
      confirmPassword: ''
    });
  };
  
 
  const handleClose = () => {
    setShowModal(false);
    resetForm();
    setSelectedUser([]);
    setSelectedPlantsOptions([]);
    setSelectedGroupOptions([]);
    setSelectedRolesOptions([]);
  }
 
  // Show modal
  const handleShowModal = async () => {
    setShowModal(true);
    isEditMode(false);
    resetForm();
    setSelectedUser([]);
    setSelectedPlantsOptions([]);
    setSelectedGroupOptions([]);
    setSelectedRolesOptions([]);
  };
 
  // Get user data for editing
const loggedInUser = userData; // Assuming loggedInUser has been set with user data

  // Get user data for editing
 // Get user data for editing
const getUserData = (data) => {
  console.log("edit data:", data);

  // Check if the employeeId of the user being edited matches the logged-in user's employeeId
  if (data.employeeId === userData.employeeId) {
    showAlert("You cannot edit your own account."); // Alert message
    return; // Exit the function, don't proceed with editing
  }

  // Set the selected user data
  setSelectedUser(data);

  // Map userPlants to the correct value/label pairs for MultiSelectComponent
  const selectedPlants = data.userPlants.map(plant => {
      let readableLabel = plant.configurevalue;
      
      // Convert "Plants001" to "Plant1", "Plants002" to "Plant2", etc.
      if (plant.configurevalue === 'Plants001') {
          readableLabel = 'Plant1';
      } else if (plant.configurevalue === 'Plants002') {
          readableLabel = 'Plant2';
      }
      
      return {
          value: plant.configurevalue,  // Keep the original value
          label: readableLabel           // Display the transformed readable label
      };
  });

  // Update the plants and groups
  setSelectedPlantsOptions(selectedPlants);
  setSelectedGroupOptions(data.userGroups || []);

  // Set the role correctly using userRole (single value)
  setSelectedRolesOptions([{ value: data.userRole, label: data.userRole }]);

  // Set edit mode and show modal
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
  
  const formValid = () => {
    const commonValidations =
      selectedUser?.firstName &&
      selectedUser?.lastName &&
      selectedUser?.employeeId &&
      selectedUser?.emailId &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser?.emailId) &&
      selectedUser?.mobileNo;
  
    if (isEdit) {
      // In edit mode, disable button only if common validations fail
      return commonValidations;
    } else {
      // In create mode, password and confirm password fields must be filled
      return (
        commonValidations &&
        selectedUser?.password &&
        selectedUser?.confirmPassword
      );
    }
  };
  
  
  
  
  // Close archive modal
  const handleCloseArchiveModal = () => setShow(false);
  // const handleCloseArchieveModal = () => setShow(false);
 
  // Archive user
  const handleArchiveUser = async (comments) => {
    try {
      archiveduser.comments = comments;  // Assign comments to the archived user object
      const deptResponse = await http.post(Appconstant.UpdateUserStatus, archiveduser);
      if (deptResponse) {
        showAlert('User Archived.');
        fetchAllUsers();  // Fetch updated user list
        handleCloseArchiveModal();  // Close the archive modal
      }
    } catch (error) {
      console.error("Error archiving user:", error);
    }
  };
  const [selectedRolesOptions, setSelectedRolesOptions] = useState([]);
  const [selectedPlantsOptions, setSelectedPlantsOptions] = useState([]);
  const [selectedGroupOptions, setSelectedGroupOptions] = useState([]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  // const [validationMessage, setValidationMessage] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);

  // This function triggers the authentication modal for archiving
  const handleShowArchiveAuthModal = () => {
    setIsArchiving(true);  // Set archiving mode to true
    setShowAuthModal(true);  // Show the authentication modal
  };
  
  // This function triggers the authentication modal for submitting the user form
  const handleShowSubmitAuthModal = () => {
    setIsArchiving(false);  // Set archiving mode to false
    setShowAuthModal(true);  // Show the authentication modal
  };
  
  
 
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };
 
  const handleAuthSubmit = () => {
    setValidationMessage('');
  
    // Get values from modal inputs
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const comments = document.getElementById('auth-comments').value;
  
    // Validate inputs
    if (!password) {
      setValidationMessage('Please enter password');
      return;
    }
  
    if (comments === '') {
      setValidationMessage('Please add comments');
      return;
    }
  
    // Check if username matches
    if (username === userData.employeeId) {
      const payload = {
        LoginId: username,
        Password: password
      };
  
      // Authenticate user with backend
      http.post("Login/AuthenticateData", payload)
        .then((resp) => {
          if (resp.data.item1) {
            // Handle archiving or submitting based on isArchiving
            if (isArchiving) {
              handleArchiveUser(comments);  // Pass comments to archive user
            } else {
              SubmitUserForm(comments);  // Handle regular form submission
            }
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
  
    // Close authentication modal after submission
    handleCloseAuthModal();
  };
  
 
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
 
                  <th>SNo</th>
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
                      {/* <td>{index + 1}</td> */}
                      <td>{indexOfFirstItem + index + 1}</td>
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
  totalItems={filteredItems.length} // Use filteredItems length for total items
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
 
 
        <Modal show={showModal} onHide={handleClose} size='lg'>
          <Modal.Header closeButton >
            <Modal.Title>{isEdit ? 'Edit User' : 'Create User'}</Modal.Title>
          </Modal.Header>
       
          <Modal.Body>
            <Form>
              <div className="row w-100">
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label>
                      Employee ID<span className="text-danger">*</span>
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
                      Email ID<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control type="email" placeholder="Email ID" name="emailId" value={selectedUser?.emailId}
                        onChange={handleFormData} disabled={isEdit}
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
                      <Form.Control style={{ outline: "1px solid black" }} type="text" placeholder="First Name*" name="firstName" onChange={handleFormData} value={selectedUser?.firstName || ''}></Form.Control>
                    </Col>
                  </Form.Group>
                </div>
 
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column >
                      Last Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control style={{ outline: "1px solid black" }} type="text" placeholder="Last Name*" name="lastName" onChange={handleFormData} value={selectedUser?.lastName || ''}></Form.Control>
                    </Col>
                  </Form.Group>
                </div>
              </div>
              <div className="row w-100">
              <div className="col-md-6">
  <Form.Group as={Row} className="mb-3" controlId="formPlaintextMobileNo">
    <Form.Label>
      Mobile Number<span className="text-danger">*</span>
    </Form.Label>
    <Col>
      <Form.Control
        type="text"
        placeholder="Mobile Number"
        name="mobileNo"
        value={selectedUser?.mobileNo}
        onChange={handleFormData}
        // disabled={isEdit}
      />
      <Form.Text className="text-danger">{errors.mobileNo}</Form.Text> {/* Display error message here */}
    </Col>
  </Form.Group>
</div>

               
                <div className="col-md-6">
  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
    <Form.Label>
      Role <span className="text-danger">*</span>
    </Form.Label>
    <Col>
      <Select
        options={getRolesResponse.map(option => ({
          value: option.configureId,
          label: option.configureValue
        }))}
        placeholder="--Select--"
        classNamePrefix="react-select"
        className="react-select-container"
        name="userRole"
        // Make sure to set value to an object or null
        value={selectedRolesOptions.length ? selectedRolesOptions[0] : null}
        onChange={(selectedOption) => {
          setSelectedRolesOptions(selectedOption ? [selectedOption] : []);
          handleFormDataDropdown(selectedOption, 'userRole');
        }}
      />
    </Col>
  </Form.Group>
</div>

 
</div>
                <div className="row w-100">
                <div className="col-md-6">
    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
      <Form.Label>
        Department<span className="text-danger">*</span>
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
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 1050 // Ensure the dropdown appears above other elements
            })
          }}
        />
      </Col>
    </Form.Group>
  </div>
             
                <div className="col-md-6">
    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label>
            Plants<span className="text-danger">*</span>
        </Form.Label>
        <Col>
            <MultiSelectComponent
                options={plantResponse.map(option => ({
                    value: option.configureId,
                    label: option.configureValue,
                    configureId: option.configureId
                }))}
                placeholder="--Select--"
                classNamePrefix="react-select"
                className="react-select-container"
                name="userPlants"
                setSelectedOptions={(data) => setSelectedPlantsOptions(data)}
                selectedOptions={selectedPlantsOptions}  // Correctly mapped selected options
            />
        </Col>
    </Form.Group>
</div>

 
 
                </div>
                {/* <div hidden className="col-md-6">
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
                </div> */}
             
              <div className="row w-100">
              <div className="col-md-6">
    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
      <Form.Label>
        Designation<span className="text-danger">*</span>
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
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 1050 // Ensure the dropdown appears above other elements
            })
          }}
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
 
 
              {/* {!isEdit &&  */}
                <div className="row w-100">
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label>
                      Password<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          name="password"
                          value={selectedUser?.password}
                          onChange={handleFormData}
                        />
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <Form.Text className="text-danger">{errors.password}</Form.Text>
                    </Col>
                  </Form.Group>
                </div>
              
                <div className="col-md-6">
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextConfirmPassword">
                    <Form.Label>
                      Confirm Password<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="position-relative">
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={selectedUser?.confirmPassword}
                          onChange={handleFormData}
                        />
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
                    </Col>
                  </Form.Group>
                </div>
              </div>
              
 
              
 
 
 
 </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button
  variant="primary"
  onClick={handleShowSubmitAuthModal}
  disabled={!formValid()}  // The button is disabled until the form is valid based on create or edit mode
>
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
            <Button variant="primary" onClick={handleShowArchiveAuthModal} disabled={!archiveduser?.comments}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
};
 
export default UserList;
 
 