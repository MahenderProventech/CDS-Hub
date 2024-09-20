import React, { useEffect, useContext, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { Bar } from 'react-chartjs-2';
import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import po from '../img/po.svg';
import { Link , useNavigate, useLocation } from 'react-router-dom';
import './Column_Dashboard.css';
import http from './Http';
import UserContext from './UserContext';



const Column_Dashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [projectOptions, setProjectOptions] = useState([]);
  const [sampleTypeOptions, setSampleTypeOptions] = useState([]);
  const [methodSetOptions, setMethodSetOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [project, setProject] = useState(null);
  const [sampleType, setSampleType] = useState(null);
  const [methodSet, setMethodSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(UserContext);



  useEffect(() => {
    if (!userData || !userData.employeeId) {
      navigate('/');
    }
  }, [userData, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    http.get(`Login/Logout?employeeId=${userData.employeeId}`);
    navigate('/');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:58747/api/Peaks/GetPeaksDetails");
        const data = await response.json();
        console.log("Fetched data:", data);
  
        if (Array.isArray(data.item2)) {
          setData(data.item2);
  
          const uniqueProjectOptions = [...new Set(data.item2.map(row => row['product_Name']))];
          const uniqueSampleTypeOptions = [...new Set(data.item2.map(row => row['peakType']))];
          const uniqueMethodSetOptions = [...new Set(data.item2.map(row => row['test_Name']))];
  
          setProjectOptions([{ value: 'All', label: 'All' }, ...uniqueProjectOptions.map(opt => ({ value: opt, label: opt }))]);
          setSampleTypeOptions([{ value: 'All', label: 'All' }, ...uniqueSampleTypeOptions.map(opt => ({ value: opt, label: opt }))]);
          setMethodSetOptions([{ value: 'All', label: 'All' }, ...uniqueMethodSetOptions.map(opt => ({ value: opt, label: opt }))]);
  
          setFilteredData(data.item2);
        } else {
          console.error("Fetched data does not contain the expected array:", data);
        }
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    let filtered = data;

    if (project && project.value !== 'All') filtered = filtered.filter(row => row['product_Name'] === project.value);
    if (sampleType && sampleType.value !== 'All') filtered = filtered.filter(row => row['peakType'] === sampleType.value);
    if (methodSet && methodSet.value !== 'All') filtered = filtered.filter(row => row['test_Name'] === methodSet.value);

    setFilteredData(filtered);
  }, [project, sampleType, methodSet, data]);

  const getPleasantColor = () => '#fade7e'; // Replace with your preferred color

  const getBarChartData = (column) => {
    const counts = filteredData.reduce((acc, row) => {
      acc[row[column]] = (acc[row[column]] || 0) + 1;
      return acc;
    }, {});
  
    const colors = Object.keys(counts).map(() => getPleasantColor());
  
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: `${column} Status`,
        data: Object.values(counts),
        backgroundColor: colors
      }]
    };
  };
  

  const barChartOptions = (titleText, xText, yText) => ({
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: titleText
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xText
        },
        min: 0 // Ensure the x-axis starts from 0
      },
      y: {
        title: {
          display: true,
          text: yText
        },
        min: 0 // Ensure the y-axis starts from 0
      }
    }
  });

  const handleReset = () => {
    setProject(null);
    setSampleType(null);
    setMethodSet(null);
  };

  return (
    <div style={{ marginLeft: '14px' }}>
      {loading && (
      <div className="page-loader">
        <div className="loading-dots">
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
        </div>
      </div>
    )}
      <aside className="col-md-1 p_sideNav">
        <div className="main">
          <div className="btn-group dropend">
            <Link to={"/home/Column_Dashboard1"}>
              <button type="button">
                <img src={dash} alt="Dashboard1" title="Dashboard1" />
                <p>Analysis</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_Dashboard"}>
              <button type="button">
                <img src={dash} alt="Dashboard" title="Dashboard" />
                <p>Dashboard</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/ColumnLog_List"}>
              <button type="button">
                <img src={HplcLogList} alt="Column Log List" title="Column Log List" />
                <p>Column Log List</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_Search"}>
              <button type="button">
                <img src={search} alt="Search" title="Search" />
                <p>Search</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_AuditTrail"}>
              <button type="button">
                <img src={report} alt="Audit Trial" title="Audit Trial" />
                <p>Audit Trial</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_UserManagement"}>
              <button type="button">
                <img src={usermanagement} alt="User Management" title="User Management" />
                <p>User Management</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend" style={{ marginTop: "10px" }}>
              <button type="button"   onClick={handleLogout}>
                <img src={po} alt="Logout" />
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="full_screen" style={{ marginLeft: "70px" }}>
        <Container>
          <h2>Column Dashboard</h2>
          <br />
          <Col>
            <Row md={3}>
              <Form.Group>
                <Form.Label><b>Project</b></Form.Label>
                <Select
                  options={projectOptions}
                  value={project}
                  onChange={setProject}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label><b>Sample Type</b></Form.Label>
                <Select
                  options={sampleTypeOptions}
                  value={sampleType}
                  onChange={setSampleType}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label><b>Method Set</b></Form.Label>
                <Select
                  options={methodSetOptions}
                  value={methodSet}
                  onChange={setMethodSet}
                />
              </Form.Group>
            </Row>

            <br />
            <Button variant="secondary" onClick={handleReset} style={{marginLeft:"1000px",backgroundColor:"#463E96"}}>Reset</Button>
            <br />
            <br />
            <Row>
            <Col md={6}>
            <h4>Integration Status</h4>
            <Bar data={getBarChartData('intType')} options={barChartOptions('Integration Status', 'Status Type', 'Count')} />
            </Col>
            <Col md={6}>
            <h4>Processing Status</h4>
            <Bar data={getBarChartData('peakType')} options={barChartOptions('Processing Status', 'Status Type', 'Count')} />
            </Col>
            </Row>

<br></br>
<br></br>

            <Row>
            
            <Col md={12}>
            <h4>Sample Set</h4>
            <Bar data={getBarChartData('sampleSetStartDate')} options={{ ...barChartOptions('Sample Set', 'Count', 'Date'), indexAxis: 'y' }} />
            </Col>
            </Row>
          </Col>
        </Container>
      </section>
    </div>
  );
};

export default Column_Dashboard;
