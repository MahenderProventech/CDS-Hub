import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user.css';
import axios from 'axios';
import * as Appconstant from '../../services/AppConstantService';
import { IoPencil } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";

const TableComponent = ({ data, setModalAction, setShowModal, setSelectedUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [columnSearchTerms, setColumnSearchTerms] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);
    // const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // if (listOfUsers) {
        let filtered = filteredData;
        if (searchTerm) {
            filtered = filtered.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            Object.keys(columnSearchTerms).forEach(key => {
                if (columnSearchTerms[key]) {
                    filtered = filtered.filter(item =>
                        item[key].toString().toLowerCase().includes(columnSearchTerms[key].toLowerCase())
                    );
                }
            });
        }

        setFilteredData(filtered);
        // }
    }, [searchTerm, columnSearchTerms]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleColumnSearch = (key, value) => {
        setColumnSearchTerms({
            ...columnSearchTerms,
            [key]: value
        });
    };

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleEditButtonClick = (user, type) => {
        setSelectedUser(user);
        setShowModal(true);
        if (type == 'edit') {
            setModalAction('edit');
        } else {
            setModalAction('view');
        }
    };


    return (
        <div>
            <div className="mbb-3" style={{ 'marginBottom': '5px' }}>
                <div className='tableSelect'>
                    <label className='tableS'>Show</label>
                    <select className='tableS'>
                        <option>10</option>
                    </select>
                    <span className='tableS'>entries</span>
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="table-wrapper">

                <Table striped bordered hover>
                    <thead>
                        <thead>

                        </thead>

                        <tr>
                            <th>#</th>
                            <th>User ID</th>
                            {/* <th>ID</th> */}
                            <th>User Name</th>
                            {/* <th>Last Name</th> */}
                            <th>Email ID</th>
                            <th>Active/Inactive</th>
                            <th>Actions</th>
                        </tr>
                    </thead>


                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.userid}</td>
                                {/* <td>{item.id}</td> */}
                                <td>{item.firstName + " " + item.middleName + " " + item.lastName}</td>
                                {/* <td>{item.lastName}</td> */}
                                <td>{item.emailId}</td>
                                <td>{item.isActive ? "Active" : "In Active"}</td>
                                <td>
                                    <Button variant="primary" size="sm" onClick={() => handleEditButtonClick(item, 'edit')}><IoPencil /></Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleEditButtonClick(item, 'view')}><IoEyeSharp /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>



                </Table>

                <div className="pagination-container">
                    <Pagination>
                        {[...Array(totalPages).keys()].map(number => (
                            <Pagination.Item
                                key={number + 1}
                                active={number + 1 === currentPage}
                                onClick={() => handlePageChange(number + 1)}
                            >
                                {number + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </div>

        </div>
    );
};

export default TableComponent;


