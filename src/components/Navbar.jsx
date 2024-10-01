import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import ProcalImg from '../img/PROCDSHUB1.svg';
import dailyreview from '../img/dailyreview.png';
import search from '../img/search.png';
import setting from '../img/setting.svg';
import report from '../img/report.png';
import audit from '../img/audit.png';
import admin from '../img/admin.png';
import home from '../img/home.png';
import dash from '../img/dashboard.png';
import po from '../img/po.svg';
import bprofile from '../img/BlackProfile.jpg';
import http from './Http';
import UserContext from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const NavbarComponent = () => {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path
  const [showModal, setShowModal] = useState(false);
  const [hover, setHover] = useState(null);
  const [autoLogoutTime, setAutoLogoutTime] = useState(2 * 60 * 1000); // Default to 2 minutes in ms
  const logoutTimerRef = useRef(null); // Ref to track logout timer

  // Fetch the settings from the API
  useEffect(() => {
    const fetchAutoLogoutTime = async () => {
      try {
        const response = await http.get('Settings/Savesettings');
        console.log('API Response:', response);  // Log the entire response
  
        // Access the autoLogout value from the first element of the response data array
        const settings = response?.data?.[0]; // Assuming the autoLogout is in the first element of the array
        if (settings?.autoLogout !== undefined) {
          const logoutTimeInMinutes = settings.autoLogout;
          const logoutTimeInMs = logoutTimeInMinutes * 60 * 1000; // Convert minutes to milliseconds
          setAutoLogoutTime(logoutTimeInMs);
  
          console.log(`Auto Logout Time fetched from API: ${logoutTimeInMinutes} minutes (${logoutTimeInMs} ms)`);
        } else {
          console.error('autoLogout field is missing in the API response.');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
  
    fetchAutoLogoutTime(); // Fetch auto-logout time on component mount
  }, []);
  
  useEffect(() => {
    if (!userData || !userData.employeeId) {
      navigate('/');
    }
  }, [userData, navigate]);

  // Function to handle manual logout
  const handleLogout = () => {
    clearListenersAndTimers(); // Ensure timers are cleared on manual logout
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.get(`Login/Logout?employeeId=${userData.employeeId}`);
        sessionStorage.clear();
        setUserData(null); // Clear user data
        navigate('/'); // Navigate to login page
        Swal.fire('Logged Out!', 'You have been logged out successfully.', 'success');
      }
    });
  };

  // Clear all timers and listeners
  const clearListenersAndTimers = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null; // Ensure the ref is cleared
    }
    window.removeEventListener('mousemove', resetLogoutTimer);
    window.removeEventListener('keydown', resetLogoutTimer);
  }, []);

  // Auto logout function
  const autoLogout = useCallback(() => {
    clearListenersAndTimers(); // Ensure timers and listeners are cleared on auto logout
    Swal.fire({
      title: 'Session Expired',
      text: 'You have been logged out due to inactivity.',
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    }).then(() => {
      setUserData(null); // Clear user data
      navigate('/'); // Navigate to login page
    });
  }, [clearListenersAndTimers, navigate, setUserData]);

  // Reset logout timer on user activity
  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(autoLogout, autoLogoutTime); // Use dynamic logout time
  }, [autoLogout, autoLogoutTime]);

  useEffect(() => {
    const isOnLoginPage = location.pathname === '/';
    if (userData && !isOnLoginPage) {
      // Add event listeners to reset timer on user activity
      window.addEventListener('mousemove', resetLogoutTimer);
      window.addEventListener('keydown', resetLogoutTimer);
      resetLogoutTimer(); // Initialize logout timer
    } else {
      clearListenersAndTimers(); // Clear everything if not logged in or on the login page
    }

    return () => {
      clearListenersAndTimers(); // Cleanup listeners and timers on component unmount
    };
  }, [userData, location.pathname, resetLogoutTimer, clearListenersAndTimers]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleMouseEnter = (buttonId) => setHover(buttonId);
  const handleMouseLeave = () => setHover(null);

  const buttonStyle = {
    backgroundColor: '#463E96',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
  };

  const imgStyle = {
    width: '20px',
    height: '25px',
  };

  const pStyle = {
    margin: '0',
    fontSize: '12px',
  };

  const isActive = (path) => location.pathname === path; // Check if the current path matches the given path


  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top" data-bs-theme="light" style={{ backgroundColor: "#463E96" }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home/Select">
            <img src={ProcalImg} width="110" alt="logo" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" style={{ lineHeight: "16px" }}>
                <span className="welcome">Welcome to<br />ProvenTech CDS HUB </span>
              </li>
              <li className="nav-item" style={{ lineHeight: "16px" }}>
                <Link to={"/home/Select"}>
                  <span className="homeImg">
                    <img src={home} alt="Home" width={"20px"} style={{ margin: "10px 20px" }} />
                  </span>
                </Link>
              </li>
            </ul>

            <div className="userDetails dropdown">
              <div className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div style={{ display: "flex" }}>
                  <br />
                  <p>{userData?.employeeId || "Role not available"} <br /> {userData?.userRole}</p>
                  <p></p>
                  <div className="picUser"></div>
                </div>
              </div>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="#" onClick={handleShow}>Profile</Link></li>
                <li className="dropdown-item" onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <aside className="p_sideNav">
        <div className="main">
          <div className="btn-group dropend">
            <Link to={"/home/Select"}>
              <button
                type="button"
                onMouseEnter={() => handleMouseEnter('dashboard')}
                onMouseLeave={handleMouseLeave}
                style={{ ...buttonStyle, backgroundColor: isActive('/home/Select') || hover === 'dashboard' ? '#3b347d' : '#463E96' }}
              >
                <img src={dash} alt="Dashboard" title="Dashboard" style={imgStyle} />
                <p style={pStyle}>Dashboard</p>
              </button>
            </Link>
          </div>

          {userData?.screenLists.includes('configuration') &&
            <div className="btn-group dropend">
              <Link to={"/home/configuration"}>
                <button
                  type="button"
                  onMouseEnter={() => handleMouseEnter('configuration')}
                  onMouseLeave={handleMouseLeave}
                  style={{ ...buttonStyle, backgroundColor: isActive('/home/configuration') || hover === 'configuration' ? '#3b347d' : '#463E96' }}
                >
                  <img src={setting} alt="Configuration" title='Configuration' style={imgStyle} />
                  <p style={pStyle}>Configuration</p>
                </button>
              </Link>
            </div>
          }

          {userData?.screenLists.includes('auditTrail') &&
            <div className="btn-group dropend">
              <Link to={"/home/auditTrail"}>
                <button
                  type="button"
                  onMouseEnter={() => handleMouseEnter('auditTrail')}
                  onMouseLeave={handleMouseLeave}
                  style={{ ...buttonStyle, backgroundColor: isActive('/home/auditTrail') || hover === 'auditTrail' ? '#3b347d' : '#463E96' }}
                >
                  <img src={audit} alt="Audit Trail" title='Audit Trail' style={imgStyle} />
                  <p style={pStyle}>Audit Trail</p>
                </button>
              </Link>
            </div>
          }
          {userData?.screenLists.includes('UserManagement') &&
            <div className="btn-group dropend">
              <Link to={"/home/userList"}>
                <button
                  type="button"
                  onMouseEnter={() => handleMouseEnter('userManagement')}
                  onMouseLeave={handleMouseLeave}
                  style={{ ...buttonStyle, backgroundColor: isActive('/home/userList') || hover === 'userManagement' ? '#3b347d' : '#463E96' }}
                >
                  <img src={admin} alt="User Management" title='User Management' style={imgStyle} />
                  <p style={pStyle}>User Management</p>
                </button>
              </Link>
            </div>
          }

          <div className="btn-group dropend" style={{ marginTop: "50px" }}>
            <button
              type="button"
              onMouseEnter={() => handleMouseEnter('version')}
              onMouseLeave={handleMouseLeave}
              style={{ ...buttonStyle, backgroundColor: hover === 'version' ? '#3b347d' : '#463E96' }}
            >
              <p style={pStyle}>Version 1.0</p>
            </button>
          </div>

          <div className="btn-group dropend" style={{ marginTop: "5px" }}>
    
              <button
                type="button"
                title='Logout'
                onMouseEnter={() => handleMouseEnter('logout')}
                onMouseLeave={handleMouseLeave}
                onClick={handleLogout}
                style={{ ...buttonStyle, backgroundColor: hover === 'logout' ? '#3b347d' : '#463E96' }}
              >
                <img src={po} alt="Logout" style={imgStyle} />
              </button>
            
          </div>
        </div>
      </aside>

      {/* Profile Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>View Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src={bprofile} alt="Profile" style={{ width: "100px", height: "100px", display: "block", borderRadius: "50%", margin: "0 auto 20px" }} />
            <h5>{userData?.employeeId}</h5>
            <p>{userData?.userRole}</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavbarComponent;
