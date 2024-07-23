import React, { useState } from 'react';
import { Table, Form, Pagination, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import './user.css';

// const data = [
//     { SNO: 1, UserID: 'JohnDoe', UserName: 'John Doe', Department: 'IT', Plant: 'Plant A', UserCreatedOn: '2021-01-01', UserInActivatedOn: '2021-06-01', Status: 'Active', Action: '' },
//     // Add more data as needed
// ];

const TableComponent = () => {
    const [data, setData] = useState([
        { id: 1, name: 'John', age: 30, city: 'New York' },
        { id: 2, name: 'Jane', age: 25, city: 'Los Angeles' },
        { id: 3, name: 'Doe', age: 35, city: 'Chicago' },
        // Add more data as needed
    ]);
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
        <Container>
            <Row>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Global Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Control
                        as="select"
                        value={perPage}
                        onChange={(e) => setPerPage(parseInt(e.target.value))}
                    >
                        {[5, 10, 15].map(option => (
                            <option key={option} value={option}>{option} entries</option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>{row.name}</td>
                            <td>{row.age}</td>
                            <td>{row.city}</td>
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
        </Container>
    );
};
export default TableComponent;