import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import { Link } from 'react-router-dom';
import http from './Http';
import po from '../img/po.svg';

 
const HPLC_Dashboard = () => {
  const [peaksData, setPeaksData] = useState([]);
  const [productNameCounts, setProductNameCounts] = useState({});
  const [arNumberCounts, setArNumberCounts] = useState({});
  const [testNameCounts, setTestNameCounts] = useState({});
  const [batchNumberCounts, setBatchNumberCounts] = useState({});
 
  const [counterData, setCounterData] = useState({
    productNameCounts: {},
    arNumberCounts: {},
    testNameCounts: {},
    batchNumberCounts: {}
  });
 
 
console.log("counterData",counterData)
 
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.get('/Peaks/GetPeaksDetails');
        const data = response.data;
        console.log('Fetched data:', data);
 
        if (Array.isArray(data.item2)) {
          const totalProductName = data.item2.length;
          const totalBatchNumber = new Set(data.item2.map(item => item.batch_No)).size;
          const totalArNumber = new Set(data.item2.map(item => item.a_R_No)).size;
          const totalTestName = new Set(data.item2.map(item => item.test_Name)).size;
 
          setCounterData({
            totalProductName,
            totalBatchNumber,
            totalArNumber,
            totalTestName
          });
        } else {
          console.error('Fetched data does not contain the expected array:', data);
        }
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };
 
    fetchData();
  }, []);
 
  useEffect(() => {
    if (counterData.totalProductName !== undefined &&
        counterData.totalBatchNumber !== undefined &&
        counterData.totalArNumber !== undefined &&
        counterData.totalTestName !== undefined) {
 
      const colors = ["#ACE9F5", "#F7B8A1", "#F9E7C4", "#A7E697"];
 
      // Chart 1: Pie chart for Category Counts
      new Chart("myChart", {
        type: "pie",
        data: {
          labels: ["Product Name", "Batch Number", "AR Number", "Test Name"],
          datasets: [{
            backgroundColor: ["#ACE9F5", "#F7B8A1", "#F9E7C4", "#A7E697"],
            data: [
              counterData.totalProductName,
              counterData.totalBatchNumber,
              counterData.totalArNumber,
              counterData.totalTestName
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: " Overall Report"
            }
          }
        }
      },);
     
     
      new Chart("myChart2", {
        type: "bar",
        data: {
          labels: ["Product Name", "Batch Number", "AR Number", "Test Name"],
          datasets: [{
            backgroundColor: ["#ACE9F5", "#F7B8A1", "#F9E7C4", "#A7E697"],
            data: [
              counterData.totalProductName,
              counterData.totalBatchNumber,
              counterData.totalArNumber,
              counterData.totalTestName
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Monthly Report"
            }
          }
        }
      });
      new Chart("myChart3", {
        type: "bar",
        data: {
          labels: ["Product Name", "Batch Number", "AR Number", "Test Name"],
          datasets: [{
            backgroundColor: ["#ACE9F5", "#F7B8A1", "#F9E7C4", "#A7E697"],
            data: [
              counterData.totalProductName,
              counterData.totalBatchNumber,
              counterData.totalArNumber,
              counterData.totalTestName
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Weekly Report"
            }
          }
        }
      });
    }
  }, [counterData]);
 
 
 
 
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
              <li className="breadcrumb-item active" aria-current="page">HPLC Dashboard</li>
            </ol>
          </nav>
 
          <div className="row">
            <div className="col-lg-12">
              <div className="card mt-3" style={{ padding: "1.7rem", width: "99%", marginLeft: "5px" }}>
                <div className="row">
                  <div className="col-sm-3">
                    <div className="mb-3">
                      <label htmlFor="fromDate" className="form-label"><b>From Date</b><span style={{ color: "red" }}>*</span></label>
                      <input type="date" id="fromDate" className="form-control" aria-label="From Date" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="mb-3">
                      <label htmlFor="toDate" className="form-label"><b>To Date</b><span style={{ color: "red" }}>*</span></label>
                      <input type="date" id="toDate" className="form-control" aria-label="To Date" aria-describedby="basic-addon1" />
                    </div>
                  </div>
                  <div className="col-sm-3 ">
                    <button className="btn btn-primary " style={{marginTop:'25px'}}>
                      Search <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          <div className="row mt-3">
            <div className="col-md-4">
              <div className="card">
                <canvas id="myChart" style={{ height: '400px' }}></canvas>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <canvas id="myChart2" style={{ height: '400px' }}></canvas>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <canvas id="myChart3" style={{ height: '400px' }}></canvas>
              </div>
            </div>
            {/* <div className="col-md-3">
              <div className="card">
                <canvas id="myChart4" style={{ height: '400px' }}></canvas>
              </div>
            </div> */}
          </div>
        </div>
      </section>
 
      {/* Modals */}
      <div className="modal fade logOutModal" id="logOutModal" tabIndex="-1">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h3 className="pt-5">Are you sure want to Logout?</h3>
              <div style={{ textAlign: 'center' }} className="py-4">
                <button className="btn btn-outline-dark mx-2" data-bs-dismiss="modal">No</button>
                <a href="../index.html" className="btn btn-primary mx-2">Yes</a>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <div className="modal fade" id="editServer" tabIndex="-1" aria-labelledby="editServerLabel" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editServerLabel">Profile</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="myProfile">
                {/* Your Profile Content */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default HPLC_Dashboard;
 