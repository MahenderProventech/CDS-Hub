import React, { useEffect, useState, useMemo } from 'react';
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

 
const UserList = () => {
  const [show, setShow] = useState(false);
  const [deptResponse, setDeptResponse] = useState([]);
  const [groupResponse, setGroupResponse] = useState([]);
  const [plantResponse, setPlantResponse] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

  const checkEmployeeIdExists = async (employeeId) => {
    try {
      const response = await http.get(Appconstant.getAllUsers);
      const existingUsers = response.data.item2;
      return existingUsers.some(user => user.employeeId === employeeId);
    } catch (error) {
      console.error("Error checking employee ID:", error);
      return false;
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
    }
  
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
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
    selectedUser.isActive = selectedUser.isActive === 'true' ? true : false;
    // Validate password first
    if (!isEdit) {
      const validationResult = validatePassword();
      if (!validationResult.isValid) {
        setErrors(validationResult.errors);
        console.log("Validation Errors:", validationResult.errors);
        return; // Stop form submission if validation fails
      }
    }
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      console.log("Validation Errors:", validationResult.errors);
      return; // Stop form submission if validation fails
    }
    
    if (!isEdit) {
      const isEmployeeIdExists = await checkEmployeeIdExists(selectedUser.employeeId);
      if (isEmployeeIdExists) {
        showAlert('Employee ID already exists. Please use a different Employee ID.');
        return; // Stop form submission if employeeId exists
      }
    }


    console.log("selected values:",selectedUser)
    // Prepare data for submission
    // const payload = {
    //   ...selectedUser,
    //   userRoles: Array.isArray(selectedRolesOptions) ? selectedRolesOptions.map(option => ({ id: parseInt(option.value, 10) })) : [],
    //   userPlants: Array.isArray(selectedPlantsOptions) ? selectedPlantsOptions.map(option => ({ id: option.value ? parseInt(option.value, 10) : 0 })) : [], // Ensure id is an integer
    //   userGroups: Array.isArray(selectedGroupOptions) ? selectedGroupOptions.map(option => ({ id: parseInt(option.value, 10) })) : [],
    // };
 
    // console.log("Payload for submission:", JSON.stringify(payload, null, 2));
 
   
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
      // Handle error
    }
  };
   
 
 
 
  useEffect(() => {
    // Fetch API settings on component mount
    axios
      .get("http://localhost:58747/api/Settings/Savesettings")
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
const getUserData = (data) => {
    console.log("edit data:", data);

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
    // Check if required fields are filled for both create and edit modes
    const commonValidations =
      selectedUser?.firstName &&
      selectedUser?.lastName &&
      selectedUser?.employeeId &&
      selectedUser?.emailId &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser?.emailId) &&  // Email validation
      selectedUser?.mobileNo;                      // Mobile number should be 10 digits
  
    if (isEdit) {
      // If editing, no need to validate password fields
      return commonValidations;
    } else {
      // If creating a new user, validate password and confirm password fields
      return (
        commonValidations &&
        selectedUser?.password &&                                     // Password field validation
        selectedUser?.confirmPassword                        // Confirm password field validation
        // selectedUser?.password === selectedUser?.confirmPassword      // Password and confirm password match
      );
    }
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
              </div>
 
 
              {!isEdit &&
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
              
 
              }
 
 
 
 </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button
  variant="primary"
  onClick={SubmitUserForm}
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
 
 