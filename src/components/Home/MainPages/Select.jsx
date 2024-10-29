import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './select.css';
import check from '../../../img/check.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from './../../UserContext';
import http from '../../Http';
import Swal from 'sweetalert2';


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

    http.get('User/GetListOfUsers')
      .then(response => {
        console.log('API response:', response.data);
        const usersData = response.data;

        const users = usersData.item2; // Access the correct property

        if (Array.isArray(users)) {
          const user = users.find(user => user.employeeId === userData.employeeId);
          console.log(user);

          if (user && user.promptExpiryDate) {
              const promptExpiryDate = new Date(user.promptExpiryDate); // Fetch the promptExpiryDate
              const expiryDate = new Date(user.expiryDate); // Fetch the expiryDate
              const currentDate = new Date();

              // Check if the current date is greater than or equal to the promptExpiryDate
              if (currentDate >= promptExpiryDate) {
                  setShowExpiryModal(true); // Set the flag to indicate that the modal has been shown

                  // Show Swal.fire popup with the expiryDate in the message
                  Swal.fire({
                      title: 'Password Expiry Notice',
                      text: `Your password will expire soon. Please change your password before ${expiryDate.toDateString()}.`,
                      icon: 'warning',
                      confirmButtonText: 'OK',
                  });
              }
          }
      } else {
          console.error('Expected an array of users, but got:', users);
      }


    //   if (Array.isArray(users)) {
    //     const user = users.find(user => user.employeeId === userData.employeeId);
    //     console.log(user);
    
    //     if (user && user.promptExpiryDate) {
    //         const promptExpiryDate = new Date(user.promptExpiryDate); // Fetch the promptExpiryDate
    //         const expiryDate = new Date(user.expiryDate); // Fetch the expiryDate
    //         const currentDate = new Date();
    
    //         // Calculate the days left from the current date to the expiry date
    //         const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    
    //         // Check if the current date is greater than or equal to the promptExpiryDate
    //         if (currentDate >= promptExpiryDate) {
    //             setShowExpiryModal(true); // Set the flag to indicate that the modal has been shown
    
    //             // Show Swal.fire popup with the days left and expiryDate in the message
    //             Swal.fire({
    //                 title: 'Password Expiry Notice',
    //                 text: `Your password will expire in ${daysLeft} days, on ${expiryDate.toDateString()}. Please change your password before it expires.`,
    //                 icon: 'warning',
    //                 confirmButtonText: 'OK',
    //             });
    //         }
    //     } else {
    //         console.error('Expected an array of users, but got:', users);
    //     }
    // }
    

        
        
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
                <p>Audit Trail</p>
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
      <section className="select"  style={{marginTop: "100px"}}>
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

            <div className="col col-lg-2">
        <Link to={"/home/ColumnFailurePredict"}>

              <div className="card nc d-flex flex-column" style={{height:"250px"}}>
                <div className="checkIcon">
                  <img src={check} alt="check" />
                </div>
                <div className="titles flex-grow-1">
                  <h3>Instrument Utilization</h3>
                </div>
                <p className="text-left">Instrument Utilization</p>
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

          <br />
          <br />

          <div className="row justify-content-md-center sMain">
          <div className="col col-lg-2">
        <Link to={"/home/ColumnFailurePredict"}>

              <div className="card nc d-flex flex-column" style={{height:"250px"}}>
                <div className="checkIcon">
                  <img src={check} alt="check" />
                </div>
                <div className="titles flex-grow-1">
                  <h3>Trends & Overlay Analysis</h3>
                </div>
                <p className="text-left">Trends & Overlay Analysis</p>
              </div>
              </Link>

            </div>
            <div className="col col-lg-2">
        <Link to={"/home/ColumnFailurePredict"}>

              <div className="card nc d-flex flex-column" style={{height:"250px"}}>
                <div className="checkIcon">
                  <img src={check} alt="check" />
                </div>
                <div className="titles flex-grow-1">
                  <h3>Peak Integration review</h3>
                </div>
                <p className="text-left">Peak Integration review</p>
              </div>
              </Link>

            </div>
            <div className="col col-lg-2">
        <Link to={"/home/ColumnFailurePredict"}>

              <div className="card nc d-flex flex-column" style={{height:"250px"}}>
                <div className="checkIcon">
                  <img src={check} alt="check" />
                </div>
                <div className="titles flex-grow-1">
                  <h3>CDS Leaderoard</h3>
                </div>
                <p className="text-left">CDS Leaderoard</p>
              </div>
              </Link>

            </div>

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
      
    </div>
  );
};

export default Select;
