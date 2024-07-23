

// import React, { useState, useEffect } from 'react';
// import { Table, Pagination } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './user.css';

// const data = [
//     { SNO: 1, UserID: 'John Doe', UserName: 28, Department: 'john@example.com',Plant:'aaa', UserCreatedOn:'aaa',UserInActivatedOn:'aa',Status:'aa',Action:'aa' },
    
// ];

// const TableComponent = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [columnSearchTerms, setColumnSearchTerms] = useState({});
//     const [currentPage, setCurrentPage] = useState(1);
//     const [filteredData, setFilteredData] = useState(data);


//     useEffect(() => {
//         let filtered = data;

//         if (searchTerm) {
//             filtered = filtered.filter(item => 
//                 Object.values(item).some(value => 
//                     value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//                 )
//             );
//         } else {
//             Object.keys(columnSearchTerms).forEach(key => {
//                 if (columnSearchTerms[key]) {
//                     filtered = filtered.filter(item => 
//                         item[key].toString().toLowerCase().includes(columnSearchTerms[key].toLowerCase())
//                     );
//                 }
//             });
//         }

//         setFilteredData(filtered);
//     }, [searchTerm, columnSearchTerms]);



//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const handleColumnSearch = (key, value) => {
//         setColumnSearchTerms({
//             ...columnSearchTerms,
//             [key]: value
//         });
//     };

//     const itemsPerPage = 10;
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentData = filteredData.slice(startIndex, endIndex);

//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//     return (
//         <div className="container mt-5">
//             <div className="mbb-3">
            
//             <div className='tableSelect'>
//                 <label>show</label>
//           <select className='tableS'>
//             <option>10</option>
//           </select>
//         <span>entries</span>
//         </div>
//                 <input 
//                     type="text" 
                    
//                     placeholder="Search..." 
//                     value={searchTerm} 
//                     onChange={(e) => setSearchTerm(e.target.value)} 
//                 />
//             </div>

//             <Table striped bordered hover >
//                 <thead>
//                     <tr>
//                         {Object.keys(data[0]).map((key) => (
//                             <th key={key}>
//                                 <input
//                                     type="text"
//                                     placeholder={key}
//                                     value={columnSearchTerms[key] || ''}
//                                     onChange={(e) => handleColumnSearch(key, e.target.value)}
//                                     className="form-control"
//                                 />
//                                 {key}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentData.map((item, index) => (
//                         <tr key={index}>
//                             {Object.values(item).map((val, idx) => (
//                                 <td key={idx}>{val}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//             <div className="pagination-container">
//                 <Pagination>
//                     {[...Array(totalPages).keys()].map(number => (
//                         <Pagination.Item 
//                             key={number + 1} 
//                             active={number + 1 === currentPage} 
//                             onClick={() => handlePageChange(number + 1)}
//                         >
//                             {number + 1}
//                         </Pagination.Item>
//                     ))}
//                 </Pagination>
//             </div>
//         </div>
//     );
// };

// export default TableComponent;
// ................................................
// import React, { useState, useEffect } from 'react';
// import { Table, Pagination, Button, Modal, Form, Row, Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Select from 'react-select'
// import './user.css';

// const data = [
//     { SNO: 1, UserID: 'JohnDoe', UserName: 'John Doe', Department: 'IT', Plant: 'Plant A', UserCreatedOn: '2021-01-01', UserInActivatedOn: '2021-06-01', Status: 'Active', Action: '' },
//     // Add more data as needed
// ];

// const TableComponent = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [columnSearchTerms, setColumnSearchTerms] = useState({});
//     const [currentPage, setCurrentPage] = useState(1);
//     const [filteredData, setFilteredData] = useState(data);
    
   
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);


//     const [plants, setPlants] = useState([
//         { id: 1, name: 'GPL Dundigal Plant Formulation', application: 'Enterprise Admin Management System', group: 'M001', role: 'IHOD', isBasePlant: true },
//         { id: 2, name: 'GPL Shamirpet Plant', application: 'Enterprise Admin Management System', group: 'M001', role: 'IHOD', isBasePlant: false },
//         { id: 3, name: 'GPL Vizag SEZ API Plant', application: 'Enterprise Admin Management System', group: 'M003', role: 'IHOD', isBasePlant: false },
//       ]);
    
//       const [isActive, setIsActive] = useState(true);
//       const [comments, setComments] = useState('');
    
//       const handleEdit = (id) => {
//         // Handle the edit action
//         console.log(`Edit plant with id: ${id}`);
//       };
    
//       const handleDelete = (id) => {
//         // Handle the delete action
//         console.log(`Delete plant with id: ${id}`);
//         setPlants(plants.filter(plant => plant.id !== id));
//       };
    
//       const handleBasePlantChange = (id) => {
//         setPlants(plants.map(plant => ({ ...plant, isBasePlant: plant.id === id })));
//       };

//     useEffect(() => {
//         let filtered = data;

//         if (searchTerm) {
//             filtered = filtered.filter(item => 
//                 Object.values(item).some(value => 
//                     value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//                 )
//             );
//         } else {
//             Object.keys(columnSearchTerms).forEach(key => {
//                 if (columnSearchTerms[key]) {
//                     filtered = filtered.filter(item => 
//                         item[key].toString().toLowerCase().includes(columnSearchTerms[key].toLowerCase())
//                     );
//                 }
//             });
//         }

//         setFilteredData(filtered);
//     }, [searchTerm, columnSearchTerms]);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const handleColumnSearch = (key, value) => {
//         setColumnSearchTerms({
//             ...columnSearchTerms,
//             [key]: value
//         });
//     };

  

//     const itemsPerPage = 10;
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentData = filteredData.slice(startIndex, endIndex);

//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);


//     const handleEditButtonClick = (user) => {
//         setSelectedUser(user);
//         setShowEditModal(true);
//     };

//     const handleDeleteButtonClick = (user) => {
//         setSelectedUser(user);
//         setShowDeleteModal(true);
//     };

//     const handleModalClose = () => {
//         setShowEditModal(false);
//         setShowDeleteModal(false);
//         setSelectedUser(null);
//     };

//     const handleDeleteConfirm = () => {
//         // Implement the delete functionality here
//         handleModalClose();
//     };

//     return (
//         <div className="container mt-5">
//             <div className="mbb-3">
//                 <div className='tableSelect'>
//                     <label>Show</label>
//                     <select className='tableS'>
//                         <option>10</option>
//                     </select>
//                     <span>entries</span>
//                 </div>
//                 <input 
//                     type="text" 
//                     placeholder="Search..." 
//                     value={searchTerm} 
//                     onChange={(e) => setSearchTerm(e.target.value)} 
//                 />
//             </div>

//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         {Object.keys(data[0]).map((key) => (
//                             <th key={key}>
//                                 <input
//                                     type="text"
//                                     placeholder={key}
//                                     value={columnSearchTerms[key] || ''}
//                                     onChange={(e) => handleColumnSearch(key, e.target.value)}
//                                     className="form-control"
//                                 />
//                                 {key}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentData.map((item, index) => (
//                         <tr key={index}>
//                             {Object.keys(item).map((key, idx) => (
//                                 <td key={idx}>
//                                     {key === 'Action' ? (
//                                         <>
//                                             <Button variant="primary" size="sm" onClick={() => handleEditButtonClick(item)}>Edit</Button>{' '}
//                                             <Button variant="danger" size="sm">Delete</Button>
//                                         </>
//                                     ) : (
//                                         item[key]
//                                     )}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//             <div className="pagination-container">
//                 <Pagination>
//                     {[...Array(totalPages).keys()].map(number => (
//                         <Pagination.Item 
//                             key={number + 1} 
//                             active={number + 1 === currentPage} 
//                             onClick={() => handlePageChange(number + 1)}
//                         >
//                             {number + 1}
//                         </Pagination.Item>
//                     ))}
//                 </Pagination>
//             </div>

//             <Modal show={showEditModal} onHide={handleModalClose} className="edit-modal">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit User</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edit-modal-body'>
//                     <Form>
//                         <div className='edit-form'>
//                         <Form.Group>
//                             <Form.Label>Organisation</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.EmpID || ''} readOnly />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Company</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.FirstName || ''} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Business Unit</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.LastName || ''} />
//                         </Form.Group>
//                         </div>
//                         {/* Add more form fields as needed */}
//                         <h5>Personal Info</h5>
//                         <div className='edit-form'>
                          
//                         <Form.Group>
//                             <Form.Label>Emp ID</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.EmpID || ''} readOnly />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Salutation</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.FirstName || ''} />
//                         </Form.Group>
//                        <div></div>
//                         </div>
//                         <div className='edit-form'>
//                         <Form.Group>
//                             <Form.Label>FirstName</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.EmpID || ''} readOnly />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Middle Name</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.FirstName || ''} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Last Name</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.LastName || ''} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Email</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.EmpID || ''} readOnly />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Mobile</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.FirstName || ''} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Department</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.LastName || ''} />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Designation</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.EmpID || ''} readOnly />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Reporting to</Form.Label>
//                             <Form.Control type="text" value={selectedUser?.FirstName || ''} />
//                         </Form.Group>
                       
//                         </div>
//                         <h5>Plants And Applications Assigning</h5>
//                         <div className='edit-form '>
//                         <Form.Group as={Col}>
//                                     <Form.Label>Plant</Form.Label>
//                                     <Select
                                     
//                                         placeholder="--Select--"
                                       
//                                         classNamePrefix="react-select"
//                                         className="react-select-container"
//                                     />
//                                 </Form.Group>

//                                 <Form.Group as={Col} >
//                                     <Form.Label>Applications</Form.Label>
//                                     <Select
                                       
//                                         placeholder="--Select--"
                                        
                                        
//                                         classNamePrefix="react-select"
//                                         className="react-select-container"
//                                     />
//                                 </Form.Group>

//                                 <Form.Group as={Col} >
//                                     <Form.Label>Role</Form.Label>
//                                     <Select
                                        
                                        
//                                         placeholder="--Select--"
                                       
//                                         classNamePrefix="react-select"
//                                         className="react-select-container"
//                                     />
//                                 </Form.Group>
//                                 <Form.Group as={Col} >
//                                     <Form.Label>Role</Form.Label>
//                                     <Select
                                        
                                        
//                                         placeholder="--Select--"
                                       
                                      
//                                     />
//                                 </Form.Group>
//                                 <Button style={{width:"100px"}}>+ Add</Button>
//                         </div>

//                         <table className='tableModal'>
//         <thead>
//           <tr>
//             <th>S. NO.</th>
//             <th>Plant Name</th>
//             <th>Application Name</th>
//             <th>Group Name</th>
//             <th>Role</th>
//             <th>Base Plant</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {plants.map((plant, index) => (
//             <tr key={plant.id}>
//               <td>{index + 1}</td>
//               <td>{plant.name}</td>
//               <td>{plant.application}</td>
//               <td>{plant.group}</td>
//               <td>{plant.role}</td>
//               <td>
//                 <input
//                   type="checkbox"
//                   checked={plant.isBasePlant}
//                   onChange={() => handleBasePlantChange(plant.id)}
//                 />
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(plant.id)}>Edit</button>
//                 <button onClick={() => handleDelete(plant.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div>
//         <label>
//           Is Active
//           <input
//             type="checkbox"
//             checked={isActive}
//             onChange={(e) => setIsActive(e.target.checked)}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Comments
//           <input
//             value={comments}
//             onChange={(e) => setComments(e.target.value)}
//             required
//             style={{width:"100%"}}
//           />
//         </label>
//         </div>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleModalClose}>
//                         Close
//                     </Button>
//                     <Button variant="primary">
//                         Save Changes
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showDeleteModal} onHide={handleModalClose} className="delete-modal">
//                 <Modal.Header closeButton>
//                     <Modal.Title>User Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div className="user-details">
//                         <p><strong>Organization:</strong> Gland Pharma Organization</p>
//                         <p><strong>Company:</strong> Gland Pharma Company</p>
//                         <p><strong>Business Unit:</strong> Gland Business Unit</p>
//                         <p><strong>Emp ID:</strong> {selectedUser?.EmpID}</p>
//                         <p><strong>Salutation:</strong> {selectedUser?.Salutation}</p>
//                         <p><strong>First Name:</strong> {selectedUser?.FirstName}</p>
//                         <p><strong>Middle Name:</strong> {selectedUser?.MiddleName}</p>
//                         <p><strong>Last Name:</strong> {selectedUser?.LastName}</p>
//                         <p><strong>Email:</strong> {selectedUser?.Email}</p>
//                         <p><strong>Mobile:</strong> {selectedUser?.Mobile}</p>
//                         <p><strong>Department:</strong> {selectedUser?.Department}</p>
//                         <p><strong>Designation:</strong> {selectedUser?.Designation}</p>
//                         <div className="plants-applications-details">
//                             <p><strong>Plants And Applications Details:</strong></p>
//                             {selectedUser?.Plant && selectedUser?.ApplicationName && (
//                                 <Table striped bordered hover>
//                                     <thead>
//                                         <tr>
//                                             <th>S.NO</th>
//                                             <th>Plant Name</th>
//                                             <th>Application Name</th>
//                                             <th>Group Name</th>
//                                             <th>Role</th>
//                                             <th>Base Plant</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td>{selectedUser.SNO}</td>
//                                             <td>{selectedUser.Plant}</td>
//                                             <td>{selectedUser.ApplicationName}</td>
//                                             <td>{selectedUser.GroupName}</td>
//                                             <td>{selectedUser.Role}</td>
//                                             <td>{selectedUser.BasePlant ? 'Yes' : 'No'}</td>
//                                         </tr>
//                                     </tbody>
//                                 </Table>
//                             )}
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleModalClose}>
//                         Close
//                     </Button>
//                     <Button variant="danger" onClick={handleDeleteConfirm}>
//                         Delete
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default TableComponent;


import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
// import './user.css';

const data = [
    { SNO: 1, UserID: 'JohnDoe', UserName: 'John Doe', Department: 'IT', Plant: 'Plant A', UserCreatedOn: '2021-01-01', UserInActivatedOn: '2021-06-01', Status: 'Active', Action: '' },
    // Add more data as needed
];

const TableComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [columnSearchTerms, setColumnSearchTerms] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(''); // New state to track the modal action

    const [plants, setPlants] = useState([
        { id: 1, name: 'GPL Dundigal Plant Formulation', application: 'Enterprise Admin Management System', group: 'M001', role: 'IHOD', isBasePlant: true },
        { id: 2, name: 'GPL Shamirpet Plant', application: 'Enterprise Admin Management System', group: 'M001', role: 'IHOD', isBasePlant: false },
        { id: 3, name: 'GPL Vizag SEZ API Plant', application: 'Enterprise Admin Management System', group: 'M003', role: 'IHOD', isBasePlant: false },
    ]);

    const [isActive, setIsActive] = useState(true);
    const [comments, setComments] = useState('');

    const handleEdit = (id) => {
        console.log(`Edit plant with id: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Delete plant with id: ${id}`);
        setPlants(plants.filter(plant => plant.id !== id));
    };

    const handleBasePlantChange = (id) => {
        setPlants(plants.map(plant => ({ ...plant, isBasePlant: plant.id === id })));
    };

    useEffect(() => {
        let filtered = data;

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

    const handleEditButtonClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
        setModalAction('edit');
    };

    const handleDeleteButtonClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
        setModalAction('delete');
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
        setModalAction('');
    };

    const handleDeleteConfirm = () => {
        setFilteredData(filteredData.filter(item => item !== selectedUser));
        handleModalClose();
    };

    return (
        <div className="container mt-5">
            <div className="mbb-3">
                <div className='tableSelect'>
                    <label>Show</label>
                    <select className='tableS'>
                        <option>10</option>
                    </select>
                    <span>entries</span>
                </div>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th key={key}>
                                <input
                                    type="text"
                                    placeholder={key}
                                    value={columnSearchTerms[key] || ''}
                                    onChange={(e) => handleColumnSearch(key, e.target.value)}
                                    className="form-control"
                                />
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <tr key={index}>
                            {Object.keys(item).map((key, idx) => (
                                <td key={idx}>
                                    {key === 'Action' ? (
                                        <>
                                            <Button variant="primary" size="sm" onClick={() => handleEditButtonClick(item)}>Edit</Button>{' '}
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteButtonClick(item)}>Delete</Button>
                                        </>
                                    ) : (
                                        item[key]
                                    )}
                                </td>
                            ))}
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

            <Modal show={showModal} onHide={handleModalClose} className="edit-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{modalAction === 'edit' ? 'Edit User' : 'Delete User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='edit-modal-body'>
                    {selectedUser && modalAction === 'edit' && (
                        <>
                            <Form>
                                <div className='edit-form'>
                                    <Form.Group>
                                        <Form.Label>Organisation</Form.Label>
                                        <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Company</Form.Label>
                                        <Form.Control type="text" value={selectedUser.FirstName || ''} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Business Unit</Form.Label>
                                        <Form.Control type="text" value={selectedUser.LastName || ''} />
                                    </Form.Group>
                                </div>
                                <h5>Personal Info</h5>
                                <div className='edit-form'>
                                    <Form.Group>
                                        <Form.Label>Emp ID</Form.Label>
                                        <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Salutation</Form.Label>
                                        <Form.Control type="text" value={selectedUser.FirstName || ''} />
                                    </Form.Group>
                                </div>
                                <div className='edit-form'>
                                    <Form.Group>
                                        <Form.Label>FirstName</Form.Label>
                                        <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type="text" value={selectedUser.FirstName || ''} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" value={selectedUser.LastName || ''} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Mobile</Form.Label>
                                        <Form.Control type="text" value={selectedUser.FirstName || ''} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control type="text" value={selectedUser.LastName || ''} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Reporting to</Form.Label>
                                        <Form.Control type="text" value={selectedUser.FirstName || ''} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Roles</Form.Label>
                                        <Form.Control type="text" value={selectedUser.LastName || ''} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Locations</Form.Label>
                                        <Form.Control type="text" value={selectedUser.LastName || ''} />
                                    </Form.Group>
                                </div>
                                <h5>User Access</h5>
                                <div className='user-access'>
                                    <Form.Group as={Col}>
                                        <Form.Label>Plant</Form.Label>
                                        <Select
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Applications</Form.Label>
                                        <Select
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Role</Form.Label>
                                        <Select
                                            placeholder="--Select--"
                                            classNamePrefix="react-select"
                                            className="react-select-container"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Role</Form.Label>
                                        <Select
                                            placeholder="--Select--"
                                        />
                                    </Form.Group>
                                    <Button style={{width:"100px"}}>+ Add</Button>
                                </div>
                            </Form>

                            <table className='tableModal'>
                                <thead>
                                    <tr>
                                        <th>S. NO.</th>
                                        <th>Plant Name</th>
                                        <th>Application Name</th>
                                        <th>Group Name</th>
                                        <th>Role</th>
                                        <th>Base Plant</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plants.map((plant, index) => (
                                        <tr key={plant.id}>
                                            <td>{index + 1}</td>
                                            <td>{plant.name}</td>
                                            <td>{plant.application}</td>
                                            <td>{plant.group}</td>
                                            <td>{plant.role}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={plant.isBasePlant}
                                                    onChange={() => handleBasePlantChange(plant.id)}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={() => handleEdit(plant.id)}>Edit</button>
                                                <button onClick={() => handleDelete(plant.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <label>
                                    Is Active
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Comments
                                    <input
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        required
                                        style={{width:"100%"}}
                                    />
                                </label>
                            </div>
                        </>
                    )}
                    {modalAction === 'delete' && (
                        <>
                       <Form>
                       <div className='edit-form'>
                           <Form.Group>
                               <Form.Label>Organisation</Form.Label>
                               <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Company</Form.Label>
                               <Form.Control type="text" value={selectedUser.FirstName || ''} />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Business Unit</Form.Label>
                               <Form.Control type="text" value={selectedUser.LastName || ''} />
                           </Form.Group>
                       </div>
                       <h5>Personal Info</h5>
                       <div className='edit-form'>
                           <Form.Group>
                               <Form.Label>Emp ID</Form.Label>
                               <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Salutation</Form.Label>
                               <Form.Control type="text" value={selectedUser.FirstName || ''} />
                           </Form.Group>
                       {/* </div>
                       <div className='edit-form'> */}
                           <Form.Group>
                               <Form.Label>FirstName</Form.Label>
                               <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Middle Name</Form.Label>
                               <Form.Control type="text" value={selectedUser.FirstName || ''} />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Last Name</Form.Label>
                               <Form.Control type="text" value={selectedUser.LastName || ''} />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Email</Form.Label>
                               <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Mobile</Form.Label>
                               <Form.Control type="text" value={selectedUser.FirstName || ''} />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Department</Form.Label>
                               <Form.Control type="text" value={selectedUser.LastName || ''} />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Designation</Form.Label>
                               <Form.Control type="text" value={selectedUser.EmpID || ''} readOnly />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label>Reporting to</Form.Label>
                               <Form.Control type="text" value={selectedUser.FirstName || ''} />
                           </Form.Group>
                         
                       </div>
                       
                   </Form>
                   <table className='tableModal'>
                                <thead>
                                    <tr>
                                        <th>S. NO.</th>
                                        <th>Plant Name</th>
                                        <th>Application Name</th>
                                        <th>Group Name</th>
                                        <th>Role</th>
                                        <th>Base Plant</th>
                                        <th>Action</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {plants.map((plant, index) => (
                                        <tr key={plant.id}>
                                            <td>{index + 1}</td>
                                            <td>{plant.name}</td>
                                            <td>{plant.application}</td>
                                            <td>{plant.group}</td>
                                            <td>{plant.role}</td>
                                           
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={plant.isBasePlant}
                                                    onChange={() => handleBasePlantChange(plant.id)}
                                                />
                                            </td>
                                            <td>
                                                
                                                <button onClick={() => handleDelete(plant.id)}>-</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                   </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={modalAction === 'delete' ? handleDeleteConfirm : handleModalClose}>
                        {modalAction === 'delete' ? 'Confirm Delete' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TableComponent;


