import React, { useState } from 'react';
import { Table, Form, Pagination, Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import './user.css';
import { IoDownload, IoEyeSharp } from "react-icons/io5";

const ReportTableComponent = ({ data, getReportContent, downloadFile }) => {

    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);

    // Function to filter data based on search query
    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    // Calculate total pages for pagination
    const totalPages = Math.ceil(filteredData.length / perPage);

    // Get paginated data
    const paginatedData = filteredData.slice(currentPage * perPage, (currentPage + 1) * perPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (

        <div style={{ width: '96%', margin: 'auto', marginTop: '10px' }}>
            <div className='card p-2'>
                <Row>
                    <Col sm={3} style={{ display: 'flex', float: 'right' }}>
                        <Form.Control
                            type="text"
                            placeholder="Global Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ border: '0.5px solid grey' }}
                        />
                    </Col >
                    {/* <Col>
                        <Form.Control
                            as="select"
                            value={perPage}
                            onChange={(e) => setPerPage(parseInt(e.target.value))}
                        >
                            {[5, 10, 15].map(option => (
                                <option key={option} value={option}>{option} entries</option>
                            ))}
                        </Form.Control>
                    </Col> */}
                </Row>
                <Table striped bordered hover>
                    <thead className='tableColor'>
                        <tr >
                            <th>S No.</th>
                            <th>Product Name</th>
                            <th>Batch Id</th>
                            <th>Test Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={row.id}>
                                <td>{index + 1}</td>
                                <td>{row.productName}</td>
                                <td>{row.batchID}</td>
                                <td>{row.testName}</td>
                                <td>
                                    <>
                                        <Button variant="transparent" size="lg" onClick={() => downloadFile()}>
                                            < IoDownload  style={{height:'1.5em',width:'1.5em',padding:'0' }}/>
                                        </Button>{' '}
                                        <Button variant="transparent" size="sm" onClick={() => getReportContent()}>
                                            <IoEyeSharp style={{height:'1.5em',width:'1.5em',padding:'0', marginLeft:'15px'}}/>
                                        </Button>
                                    </>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index === currentPage}
                            onClick={() => handlePageChange(index)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                </Pagination>
            </div>
        </div>
    );
};
export default ReportTableComponent;