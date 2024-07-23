
import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import Select, { components } from 'react-select';
import TableComponent from './TableComponent';
import { utils, writeFile } from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { MultiSelect } from "react-multi-select-component";
import * as Appconstant from '../../services/AppConstantService';
// import * as http from '../Http';
// import CustomMultiSelect from "../core/CustomMultiSelect";
import axios from 'axios';
import AddEditUserForm from './AddEditUserForm';

const serviceProviderData = [
    {
        S_No: 1,
        User_ID: "101010",
        First_Name: "Service",
        Middle_Name: "Provider",
        Last_Name: "SP",
        Department: "Service Provider Department",
        Role: "ServiceProviderRole",
        Plant: "ServiceProviderPlant"
    }
];

const UserCreation = () => {
    const [selectedOption, setSelectedOption] = useState("print");
    // const [selectedPlants, setSelectedPlants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [openCreateUserForm, setOpenCreateUserForm] = useState(false);
    const [showPrintTable, setShowPrintTable] = useState(false);
    const [show, setShow] = useState(false);
    const [plantSelected, setPlantSelected] = useState([]);
    const [applicationSelected, setApplicationSelected] = useState([]);
    const [roleSelected, setRoleSelected] = useState([]);

    const [plantsData, setPlantsData] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [groupsData, setGroupsData] = useState([]);
    const [listOfUsers, setListOfUsers] = useState([]);
    const [modalAction, setModalAction] = useState(''); // New state to track the modal action
    const [selectedUser, setSelectedUser] = useState(null);
    // const [formData, setFormData] = useState(selectedUser);
    const onPrintClick = useRef();

    const onPrint = useReactToPrint({
        content: () => onPrintClick.current,
        documentTitle: "user data",
        onAfterPrint: () => setShowPrintTable(false)
    });

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handlePrint = () => {
        setShowPrintTable(true);
        setTimeout(() => {
            onPrint();
        }, 0);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
        setModalAction('');
    };
    const handleExportToExcel = (type) => {
        let filteredData;
        // Filter data based on type (e.g., 'InActive', 'Active', 'Locked')
        switch (type) {
            case 'InActive':
                filteredData = data; // Apply actual filter for inactive users
                break;
            case 'Active':
                filteredData = data; // Apply actual filter for active users
                break;
            case 'Locked':
                filteredData = data; // Apply actual filter for locked users
                break;
            default:
                filteredData = data;
        }

        const worksheet = utils.json_to_sheet(filteredData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Users');
        writeFile(workbook, `${type}Users.xlsx`);
    };

    const data = [
        { id: 1, name: 'John Doe', age: 28, email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', age: 34, email: 'jane@example.com' },
        { id: 3, name: 'Sam Green', age: 45, email: 'sam@example.com' },
    ];

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        // Function to fetch data using Axios
        fetchUsersData();
        fetchRolesData();
        fetchPlants();
        fetchGroups();
        // Cleanup function (optional)
        return () => {
            // Perform any cleanup here if necessary
        };

    }, []);

    const fetchRolesData = async () => {
        try {
            console.log(Appconstant.userGetRoles);
            const response = await axios.get(Appconstant.userGetRoles);
            console.log("userGetRoles", response.data.item2)
            setRolesData(response.data.item2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchPlants = async () => {
        try {
            console.log(Appconstant.getPlants);
            const response = await axios.get(Appconstant.getPlants);
            console.log("getPlants", response.data.item2)
            setPlantsData(response.data.item2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchGroups = async () => {
        try {
            console.log(Appconstant.getGroups);
            const response = await axios.get(Appconstant.getGroups);
            console.log("getGroups", response.data.item2)
            setGroupsData(response.data.item2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchUsersData = async () => {
        try {
            console.log(Appconstant.getAllUsers);
            const response = await axios.get(Appconstant.getAllUsers);
            console.log("getAllUsers", response.data.item2)
            setListOfUsers(response.data.item2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleFormData = (e) => {
        console.log(e)
        const { name, value } = e.target;
        setSelectedUser({
            ...selectedUser,
            [name]: value
        });
    };
    return (
        <section className="full_screen" style={{ padding: '0 30px' }}>
            <div className='btnModal'>
                <Button variant="primary" onClick={handleShow} style={{ display: 'flex', 'justifyContent': 'end', margin: ' 5px' }}>
                    Create
                </Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Employee ID/User ID*</Form.Label>
                            <Form.Control type="text" placeholder="Enter your Employee ID/User ID" name="employeeId" value={selectedUser?.employeeId} onChange={handleFormData} />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={() => { setModalAction('create'); setShowModal(true); setShow(false) }}>
                            GO
                        </Button>
                    </Modal.Body>
                </Modal>
            </div>
            <Row style={{
                'width': '96 %',
                'margin': 'auto'
            }}>

                <Card>
                    <Card.Header as="h4" className='Cardtitle'>User Creation</Card.Header>
                    <Card.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridPlant">
                                    <Form.Label>Plant</Form.Label>
                                    <MultiSelect
                                        options={plantsData.map(option => ({ value: option.id, label: option.name }))}
                                        ClearIcon="circle"

                                        value={plantSelected}
                                        onChange={setPlantSelected}
                                    />

                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridApplications">
                                    <Form.Label>Groups</Form.Label>
                                    <MultiSelect
                                        options={groupsData.map(option => ({ value: option.id, label: option.name }))}
                                        value={applicationSelected}
                                        onChange={setApplicationSelected} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridRole">
                                    <Form.Label>Role</Form.Label>
                                    <MultiSelect
                                        options={rolesData.map(option => ({ value: option.id, label: option.name }))}
                                        value={roleSelected}
                                        onChange={setRoleSelected}

                                    />
                                </Form.Group>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
            <div className='mt-4 p-2' style={{ 'float': 'right' }}>
                <div style={{ 'justifyContent': 'end', 'display': 'flex' }}>
                    <span className='m-3'>
                        <input
                            type="radio"
                            id="printOption"
                            name="option"
                            value="print"
                            onChange={handleRadioChange}
                            checked={selectedOption === "print"}
                        />
                        <label htmlFor="printOption">Print Buttons</label>
                    </span>
                    <span className='m-3'>
                        <input
                            type="radio"
                            id="excelOption"
                            name="option"
                            value="excel"
                            onChange={handleRadioChange}
                            checked={selectedOption === "excel"}
                        />
                        <label htmlFor="excelOption">Excel Buttons</label>
                    </span>
                </div>
                {selectedOption === "print" && (
                    <div>
                        <Button style={{ margin: '10px', backgroundColor: '#0d6efd', color: '#ffffff' }} onClick={() => handlePrint('InActive')}>InActive Users Print</Button>
                        <Button style={{ margin: '10px', backgroundColor: '#0d6efd', color: '#ffffff' }} className='m-2' onClick={() => handlePrint('Active')}>Active Users Print</Button>
                        <Button style={{ margin: '10px', backgroundColor: '#0d6efd', color: '#ffffff' }} className='m-2' onClick={() => handlePrint('Locked')}>Locked Users Print</Button>
                    </div>
                )}
                {selectedOption === "excel" && (
                    <div>
                        <Button style={{ margin: '10px', backgroundColor: 'green', color: '#ffffff' }} className='excel-buttons' variant='primary' onClick={() => handleExportToExcel('InActive')}>InActive Users Export to excel</Button>
                        <Button style={{ margin: '10px', backgroundColor: 'green', color: '#ffffff' }} onClick={() => handleExportToExcel('Active')}>Active Users Export to excel</Button>
                        <Button style={{ margin: '10px', backgroundColor: 'green', color: '#ffffff' }} onClick={() => handleExportToExcel('Locked')}>Locked Users Export to excel</Button>
                    </div>
                )}
            </div>
            <br />
            <div>
                <div className="table-container">
                    {listOfUsers.length > 0 &&
                        <TableComponent data={listOfUsers}
                            setModalAction={(data) => { console.log(data); setModalAction(data) }}
                            setShowModal={(data) => setShowModal(data)}
                            setSelectedUser={(user) => setSelectedUser(user)}
                        />
                    }
                </div>

                {/*  print table */}
                <div style={{ display: 'none' }}>
                    <div ref={onPrintClick}>
                        <div className='print-head'>
                            <p>Heading</p>
                            <p>Heading</p>
                            <p>Heading</p>
                            <div className='print-img'></div>
                        </div>
                        <table border="1" style={{ width: "100%", fontSize: "1rem" }}>
                            <thead>
                                <tr>
                                    <th>S. No.</th>
                                    <th>User ID</th>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Last Name</th>
                                    <th>Department</th>
                                    <th>Role</th>
                                    <th>Plant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceProviderData.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.S_No}</td>
                                        <td>{user.User_ID}</td>
                                        <td>{user.First_Name}</td>
                                        <td>{user.Middle_Name}</td>
                                        <td>{user.Last_Name}</td>
                                        <td>{user.Department}</td>
                                        <td>{user.Role}</td>
                                        <td>{user.Plant}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <AddEditUserForm showModal={showModal} handleModalClose={() => handleModalClose()}
                modalAction={modalAction} selectedUser={selectedUser} plantsData={plantsData}
                rolesData={rolesData} groupsData={groupsData}
                handleFormData={(e) => handleFormData(e)} />

        </section >
    );
};

export default UserCreation;



