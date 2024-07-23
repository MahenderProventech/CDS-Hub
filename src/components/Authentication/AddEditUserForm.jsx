import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import * as Appconstant from '../../services/AppConstantService';
import { IoTrashSharp } from "react-icons/io5";
const AddEditUserForm = ({ showModal, handleModalClose, modalAction, selectedUser, plantsData, rolesData, groupsData, handleFormData }) => {
    console.log(selectedUser)
    console.log(modalAction)
    const [isActive, setIsActive] = useState(true);
    const [comments, setComments] = useState('');
    const [formData, setFormData] = useState([
        { id: 1, plant: '', application: '', group: '', role: '' },
    ]);
    const handleEdit = (id) => {
        console.log(`Edit plant with id: ${id}`);
    };
    const handleDelete = (id) => {
        console.log(`Delete plant with id: ${id}`);
        // setPlants(plants.filter(plant => plant.id !== id));
    };
    const handleFormDataChange = (index, field, value) => {
        const updatedFormData = [...formData];
        updatedFormData[index][field] = value;
        setFormData(updatedFormData);
    };
    const handleRemoveField = (index) => {
        const updatedFormData = [...formData];
        updatedFormData.splice(index, 1);
        setFormData(updatedFormData);
    };
    const handleAddField = () => {
        setFormData([
            ...formData,
            { id: formData.length + 1, plant: '', application: '', group: '', role: '' },
        ]);
    };
    const SubmitUserForm = async () => {
        console.log(selectedUser);

        try {
            const response = await axios.post(Appconstant.submitUserForm, selectedUser);
            // setResponse(response.data);
            console.log(response);
        } catch (error) {
            // setError(error.message);
        }
    }
    return (

        <Modal show={showModal} onHide={handleModalClose} className='custom-modal'>
            <Modal.Header closeButton>
                <Modal.Title>{modalAction === 'edit' ? 'Edit User' : modalAction === 'create' ? 'Create User' : 'Delete User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <Form>
                        <div className='edit-form'>
                            <div className="row w-100">
                                <div className="col-md-4 mb-3">
                                    <Form.Group>
                                        <Form.Label>Emp ID</Form.Label>
                                        <Form.Control type="text" onChange={handleFormData} value={selectedUser?.employeeId || ''} readOnly />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                        <div className='edit-form'>
                            <div className="row w-100">
                                <div className="col-md-4 mb-3">
                                    <Form.Group>
                                        <Form.Label>Organisation</Form.Label>
                                        {/* <Form.Control type="text" name="organizationId" onChange={handleFormData} value={selectedUser?.organizationId || ''} /> */}
                                        <Select
                                            options={rolesData.map(option => ({ value: option.id, label: option.name }))}
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                            onChange={handleFormData}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Group>
                                        <Form.Label>Company</Form.Label>
                                        {/* <Form.Control type="text" name="companyId" onChange={handleFormData} value={selectedUser?.companyId || ''} /> */}
                                        <Select
                                            options={rolesData.map(option => ({ value: option.id, label: option.name }))}
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                            onChange={handleFormData}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Form.Group>
                                        <Form.Label>Business Unit</Form.Label>
                                        {/* <Form.Control type="text" name="businessUnitId" onChange={handleFormData} value={selectedUser?.businessUnitId || ''} /> */}
                                        <Select
                                            options={rolesData.map(option => ({ value: option.id, label: option.name }))}
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                            onChange={handleFormData}
                                        />
                                    </Form.Group>

                                </div>
                            </div>
                        </div>
                        <hr />
                        <h5>Personal Info</h5>

                        <div className='edit-form'>
                            <div className="row w-100">
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Salutation</Form.Label>
                                        <Form.Control type="text" onChange={handleFormData} name="salutationId" value={selectedUser?.salutationId || ''} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>FirstName</Form.Label>
                                        <Form.Control type="text" name="firstName" onChange={handleFormData} value={selectedUser?.firstName || ''} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type="text" name="middleName" onChange={handleFormData} value={selectedUser?.middleName || ''} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" name="lastName" onChange={handleFormData} value={selectedUser?.lastName || ''} />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                        <div className='edit-form'>
                            <div className="row w-100">
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" name="emailId" onChange={handleFormData} value={selectedUser?.emailId || ''} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Mobile</Form.Label>
                                        <Form.Control type="text" name="mobileNo" onChange={handleFormData} value={selectedUser?.mobileNo || ''} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control type="text" name="departmentId" onChange={handleFormData} value={selectedUser?.departmentId || ''} readOnly={modalAction == 'delete'} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control type="text" onChange={handleFormData} name="designationId" value={selectedUser?.designationId || ''} />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>

                        <div className='edit-form'>
                            <div className="row w-100">
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Reporting to</Form.Label>
                                        <Form.Control type="text" onChange={handleFormData} name="reportingPersonId" value={selectedUser?.reportingPersonId || ''} />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <h5>User Access</h5>

                        <div>
                            {formData.map((data, index) => (
                                <div key={data.id} className='edit-form row align-items-center'>
                                    <Form.Group as={Col}>
                                        <Form.Label>Plant</Form.Label>
                                        <Select
                                            options={plantsData.map(option => ({ value: option.id, label: option.name }))}
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                            value={data.plant}
                                            onChange={(selectedOption) => handleFormDataChange(index, 'plant', selectedOption)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Applications</Form.Label>
                                        <Select
                                            options={rolesData.map(option => ({ value: option.id, label: option.name }))}
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                            value={data.application}
                                            onChange={(selectedOption) => handleFormDataChange(index, 'application', selectedOption)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Group</Form.Label>
                                        <Select
                                            options={groupsData.map(option => ({ value: option.id, label: option.name }))}
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                            value={data.group}
                                            onChange={(selectedOption) => handleFormDataChange(index, 'group', selectedOption)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Role</Form.Label>
                                        <Select
                                            options={rolesData.map(option => ({ value: option.id, label: option.name }))}
                                            placeholder="--Select--"
                                            value={data.role}
                                            onChange={(selectedOption) => handleFormDataChange(index, 'role', selectedOption)}
                                        />
                                    </Form.Group>
                                    {index !== 0 && (
                                        <Button style={{ width: "fit-content" }} className="col-1" onClick={() => handleRemoveField(index)}><IoTrashSharp /></Button>
                                    )}
                                    <Button style={{ width: "fit-content" }} onClick={handleAddField}>+</Button>
                                </div>
                            ))}

                        </div>
                    </Form>

                </>
            </Modal.Body>
            {modalAction !== 'view' &&
                <Modal.Footer>
                    <Button variant="primary" onClick={SubmitUserForm}>
                        Submit
                    </Button>
                </Modal.Footer>
            }

        </Modal>
    );
};

export default AddEditUserForm;
