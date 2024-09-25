import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './select.css';
import check from '../../../img/check.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from './../../UserContext';



const Select = () => {
  const { userData } = useContext(UserContext); // Access user data from context
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [expiryMessage, setExpiryMessage] = useState('');

  useEffect(() => {
    if (!userData || !userData.employeeId) {
      console.error('User is not logged in or employee ID is not available.');
      return; // Exit if user is not logged in
    }

    axios.get('http://localhost:58747/api/User/GetListOfUsers')
      .then(response => {
        console.log('API response:', response.data);
        const usersData = response.data;

        const users = usersData.item2; // Access the correct property

        if (Array.isArray(users)) {
          // Find the user with the specific EmployeeId from context
          const user = users.find(user => user.employeeId === userData.employeeId);
          if (user && user.promptExpiryDate) {
            const promptExpiryDate = new Date(user.promptExpiryDate);
            const currentDate = new Date();

            if (currentDate >= promptExpiryDate) {
              setExpiryMessage(`Your prompt expiry date has passed. It was on ${promptExpiryDate.toDateString()}. Please take action.`);
              setShowExpiryModal(true);
            }
          }
        } else {
          console.error('Expected an array of users, but got:', users);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [userData]); // Add userData as a dependency
  const handleLogout = () => {
    // Perform logout functionality here
    console.log('Logging out...');
    // Redirect to the logout page or perform any necessary actions
  };

  return (
    <div>   

      {/* <aside className="p_sideNav">
        <div className="main">
          <div className="btn-group dropend">
            <a href="">
              <button type="button">
                <img
                  src={conf}
                  alt="Configuration"
                  title="Configuration"
                />
                <p>Configuration</p>
              </button>
            </a>
          </div>

          <div className="btn-group dropend">
            <a href="./userlist.html">
              <button type="button">
                <img src={roles} alt="Roles" title="Roles" />
                <p>Users</p>
              </button>
            </a>
          </div>

          <div className="btn-group dropend">
            <a href="">
              <button type="button">
                <img src={report} alt="Reports" title="Reports" />
                <p>Audit Trial</p>
              </button>
            </a>
          </div>
        </div>

        <a
          data-bs-toggle="modal"
          data-bs-target="#logOutModal"
          title="Logout"
          className="logout"
        >
          <img src="../img/po.svg" alt="logout" />
        </a>
      </aside>        */}
      <section className="select">
      <div className="container-fluid text-center">
  <div className="row justify-content-md-center sMain">
    <div className="col col-lg-2" >
      <div className="card nc d-flex flex-column" style={{height:"250px"}}>
        <div className="checkIcon">
          <img src={check} alt="check" />
        </div>
        <div className="titles flex-grow-1">
          <h3>Usage Log</h3>
        </div>
        <a
          className="innerCard d-flex flex-column justify-content-left align-items-left"
          id="ftir_link"
        >
         <Link to={"/home/HPLC_Dashboard"}>
          <div className="text-left">
            <h3 style={{ fontSize: '18px', marginBottom: '0' }}>HPLC Log</h3>
          </div>
          </Link>
        </a>
        <a
          id="uv_link"
          className="innerCard mt-2 d-flex flex-column justify-content-left align-items-left"
        >
        <Link to={"/home/Column_Dashboard"}>
          <div className="text-left">
            <h3 style={{ fontSize: '18px', marginBottom: '0' }}>Column Log</h3>
          </div>
          </Link>
        </a>
      </div>
    </div>

            {/* <div className="col-lg-2 mb-4">
              <div className="card nc h-100 d-flex flex-column">
                <div className="checkIcon">
                  <img src="../img/check.png" alt="check" />
                </div>
                <div className="titles flex-grow-1">
                  <h3>eLog</h3>
                </div>
                <p className="text-left">eLog</p>
              </div>
            </div> */}
            
            <div className="col col-lg-2">
        <Link to={"/home/ColumnFailurePredict"}>

              <div className="card nc d-flex flex-column" style={{height:"250px"}}>
                <div className="checkIcon">
                  <img src={check} alt="check" />
                </div>
                <div className="titles flex-grow-1">
                  <h3>Column Failure Prediction</h3>
                </div>
                <p className="text-left">Column Failure Prediction</p>
              </div>
              </Link>

            </div>

            {/* <div className="col-lg-2 mb-4">
              <div className="card lims h-100 d-flex flex-column">
                <div className="checkIcon">
                  <img src="../img/check.png" alt="check" />
                </div>
                <div className="titles flex-grow-1">
                  <h3>Extract Ease</h3>
                </div>
                <p className="text-left">Extract Ease</p>
              </div>
            </div> */}
          </div>
          <div className="row">
            <div className="col text-center">
              <p className="redirectButton">* Click on above tile to redirect</p>
            </div>
          </div>
        </div>
      </section>

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to Logout?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-4">
            <Button variant="outline-dark" onClick={() => setShowLogoutModal(false)}>
              No
            </Button>
            <Button variant="primary" className="mx-2" onClick={handleLogout}>
              Yes
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Expiry Date Modal */}
      <Modal show={showExpiryModal} onHide={() => setShowExpiryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Expiry Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{expiryMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowExpiryModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Select;
