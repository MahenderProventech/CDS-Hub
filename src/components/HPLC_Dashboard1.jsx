import React, { useState, useEffect } from 'react';
import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import { Link } from 'react-router-dom';
import po from '../img/po.svg';

 
const HPLC_Dashboard = () => {
  return (
    <div style={{marginLeft:'14px'}}>
      <aside className="col-md-1 p_sideNav">
        <div className="main">
        <div className="btn-group dropend">
            <Link to={"/home/HPLC_Dashboard1"}>
              <button type="button">
                <img src={dash} alt="HPLCDashboard1" title="HPLCDashboard1" />
                <p>Dashboard 1</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Dashboard"}>
              <button type="button">
                <img src={dash} alt="HPLCDashboard" title="HPLCDashboard" />
                <p>Dashboard</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLCLog_List"}>
              <button type="button">
                <img src={HplcLogList} alt="HPLC Log List" title="HPLC Log List" />
                <p>HPLC Log List</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Search"}>
              <button type="button">
                <img src={search} alt="Search" title="Search" />
                <p>Search</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_AuditTrail"}>
              <button type="button">
                <img src={report} alt="Audit Trial" title="Audit Trial" />
                <p>Audit Trial</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_UserManagement"}>
              <button type="button">
                <img src={usermanagement} alt="User Management" title="User Management" />
                <p>User Management</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend" style={{ marginTop: "10px" }}>
                        <Link to={"/"}>
                            <button type="button" title='Logout'>
                                <img src={po} alt="Logout" />
                            </button>
                        </Link>
                    </div>
        </div>
      </aside>
      <section className="full_screen">
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb cooseText mb-2">
              <li className="breadcrumb-item active" aria-current="page">HPLC Dashboard 1</li>
            </ol>
          </nav>
 
         
        </div>
      </section>
 
   </div>
  );
};
 
export default HPLC_Dashboard;
 