import React from 'react';
import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import { Link, useNavigate } from 'react-router-dom';
 
const Column_AuditTrail = () => {
  // Define any necessary functions or state here
 
  return (
    <div>
         <aside className="col-md-1 p_sideNav">
          <div className="main">
            <div className="btn-group dropend">
            <Link to={"/home/Column_Dashboard"}>
            <button type="button">
                  <img src={dash} alt="Dashboard" title="Dashboard" />
                  <p>Dashboard</p>
                </button>
              </Link>
            </div><br/>
            <div className="btn-group dropend">
            <Link to={"/home/ColumnLog_List"}>
            <button type="button">
                  <img src={HplcLogList} alt="Column Log List" title="Column Log List" />
                  <p>Column Log List</p>
                </button>
              </Link>
            </div><br/>
            <div className="btn-group dropend">
            <Link to={"/home/Column_Search"}>
                <button type="button">
                  <img src={search} alt="Search" title="Search" />
                  <p>Search</p>
                </button>
              </Link>
            </div><br/>
            <div className="btn-group dropend">
            <Link to={"/home/Column_AuditTrail"}>
                <button type="button">
                  <img src={report} alt="Audit Trial" title="Audit Trial" />
                  <p>Audit Trial</p>
                </button>
              </Link>
            </div><br/>
            <div className="btn-group dropend">
            <Link to={"/home/Column_UserManagement"}>
                <button type="button">
                  <img src={usermanagement} alt="User Management" title="User Management" />
                  <p>User Management</p>
                </button>
              </Link>
            </div><br/>
          </div>

          </aside> 
          <section className="full_screen" style={{backgroundColor:'#e9ecef'}}>
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb cooseText mb-2">
              <li className="breadcrumb-item active" aria-current="page">Column Audit Trail</li>
            </ol>
          </nav>
          </div>
          </section>
          </div>
  );
};
 
export default Column_AuditTrail;
 