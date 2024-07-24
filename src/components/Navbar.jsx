import ProcalImg from '../img/PROCDSHUB1.svg';
import dailyreview from '../img/dailyreview.png';
import search from '../img/search.png';
import setting from '../img/setting.svg';
import report from '../img/report.png';
import audit from '../img/audit.png';
import admin from '../img/admin.png';
import home from '../img/home.png';
import http from './Http';
import po from '../img/po.svg';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import React, { useEffect, useContext } from 'react';
import dash from '../img/dashboard.png';

 
const NavbarComponent = () => {
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();
 
    useEffect(() => {
        if (!userData || !userData.employeeId) {
            navigate('/');
        }
    }, [userData, navigate]);
    const handleLogout = () => {
        sessionStorage.clear();
        console.log("hiiiiiiiiiiiiiiii")
         http.get(`Login/Logout?employeeId=${userData.employeeId}`);
        navigate('/');
 
    }
 
    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top" data-bs-theme="light"
                style={{ backgroundColor: "#463E96" }}>
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
                                <li><Link className="dropdown-item" to="/dashboard">Profile</Link></li>
                                <li><Link className="dropdown-item" to="/dashboard">Settings</Link></li>
                                {/* <li><Link className="dropdown-item" to="#" onClick={handleLogout}>Logout</Link></li> */}
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
            <button type="button">
                  <img src={dash} alt="Dashboard" title="Dashboard" />
                  <p>Dashboard</p>
                </button>
              </Link>
            </div>
 
                    
                    {(userData?.screenLists.includes('configuration')) &&
                        <div className="btn-group dropend">
                            <Link to={"/home/configuration"}>
                                <button type="button">
                                    <img src={setting} alt="Configuration" title='Configuration' />
                                    <p>Configuration</p>
                                </button>
                            </Link>
                        </div>
                    }
 
                    
                    {(userData?.screenLists.includes('auditTrail')) &&
                        <div className="btn-group dropend">
                            <Link to={"/home/auditTrail"}>
                                <button type="button">
                                    <img src={audit} alt="Audit Trail" title='Audit Trail' />
                                    <p>Audit Trail</p>
                                </button>
                            </Link>
                        </div>
                    }
                    {(userData?.screenLists.includes('UserManagement')) &&
                        <div className="btn-group dropend">
                            <Link to={"/home/userList"}>
                                <button type="button">
                                    <img src={admin} alt="User Management" title='User Management' />
                                    <p>User Management</p>
                                </button>
                            </Link>
                        </div>
                    }

                        <div className="btn-group dropend" style={{ marginTop: "70px" }}>
                                <button type="button">
                                    <p>Version 1.0</p>
                                </button>
                        </div>

                    <div className="btn-group dropend" style={{ marginTop: "10px" }}>
                        <Link to={"/"}>
                            <button type="button" title='Logout'>
                                <img src={po} alt="Logout" />
                            </button>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
};
 
export default NavbarComponent;
