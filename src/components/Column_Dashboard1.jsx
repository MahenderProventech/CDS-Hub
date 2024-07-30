import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { Scatter } from 'react-chartjs-2';
import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import po from '../img/po.svg';
import { Link } from 'react-router-dom';

const Column_Dashboard1 = () => {
  const [data, setData] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [sampleTypeOptions, setSampleTypeOptions] = useState([]);
  const [methodSetOptions, setMethodSetOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [project, setProject] = useState(null);
  const [sampleType, setSampleType] = useState(null);
  const [methodSet, setMethodSet] = useState(null);
  const [xColumn, setXColumn] = useState(null);
  const [yColumn, setYColumn] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:58747/api/Peaks/GetPeaksDetails");
        const result = await response.json();
        console.log("Fetched data:", result);

        if (Array.isArray(result.item2)) {
          const fetchedData = result.item2;
          setData(fetchedData);

          // Generate options for select components
          const projects = [...new Set(fetchedData.map(row => row['product_Name']))];
          const sampleTypes = [...new Set(fetchedData.map(row => row['peakType']))];
          const methodSets = [...new Set(fetchedData.map(row => row['test_Name']))];

          console.log("Project options:", projects);
          console.log("Sample Type options:", sampleTypes);
          console.log("Method Set options:", methodSets);

          setProjectOptions([{ value: 'All', label: 'All' }, ...projects.map(opt => ({ value: opt, label: opt }))]);
          setSampleTypeOptions([{ value: 'All', label: 'All' }, ...sampleTypes.map(opt => ({ value: opt, label: opt }))]);
          setMethodSetOptions([{ value: 'All', label: 'All' }, ...methodSets.map(opt => ({ value: opt, label: opt }))]);
          setFilteredData(fetchedData);
        } else {
          console.error("Fetched data does not contain the expected array:", result);
        }
      } catch (error) {
        console.error("Error fetching or processing data:", error);
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

  const getColumnOptions = () => {
    return data.length ? Object.keys(data[0]).map(col => ({ value: col, label: col })) : [];
  };

  const getChartData = (xCol, yCol) => {
    if (!xCol || !yCol) return { datasets: [] };

    const xValues = filteredData.map(row => row[xCol]);
    const yValues = filteredData.map(row => row[yCol]);

    console.log('xValues:', xValues);
    console.log('yValues:', yValues);

    const groupedData = filteredData.reduce((acc, row, index) => {
      const instrument = row['instrument_No'];
      if (!acc[instrument]) {
        acc[instrument] = { x: [], y: [], label: `Instrument ${instrument}`, color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)` };
      }
      acc[instrument].x.push(xValues[index]);
      acc[instrument].y.push(yValues[index]);
      return acc;
    }, {});

    console.log('Grouped Data:', groupedData);

    const datasets = Object.values(groupedData).map(group => ({
      label: group.label,
      data: group.x.map((x, index) => ({ x, y: group.y[index], instrument: group.label })),
      backgroundColor: group.color,
    }));

    return {
      datasets
    };
  };

  const scatterChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const { dataset } = tooltipItems[0];
            const instrument = dataset.data[tooltipItems[0].dataIndex].instrument;
            return [`Instrument: ${instrument}`];
          },
          label: (tooltipItem) => {
            const { raw } = tooltipItem;
            const xValue = raw.x;
            const yValue = raw.y;
            return [
              `${xColumn ? xColumn.label : ''}: ${xValue}`,
              `${yColumn ? yColumn.label : ''}: ${yValue}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xColumn ? xColumn.label : ''
        },
        type: filteredData.every(row => isNaN(row[xColumn?.value])) ? 'category' : 'linear',
        min: 0
      },
      y: {
        title: {
          display: true,
          text: yColumn ? yColumn.label : ''
        },
        min: 0
      }
    }
  };

  const handleReset = () => {
    setProject(null);
    setSampleType(null);
    setMethodSet(null);
    setXColumn(null);
    setYColumn(null);
  };

  return (
    <div style={{ marginLeft: '14px' }}>
      <aside className="col-md-1 p_sideNav">
        <div className="main">
          <div className="btn-group dropend">
            <Link to={"/home/Column_Dashboard1"}>
              <button type="button">
                <img src={dash} alt="Dashboard1" title="Dashboard1" />
                <p>Dashboard 1</p>
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
                <img src={report} alt="Audit Trail" title="Audit Trail" />
                <p>Audit Trail</p>
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
            <Link to={"/"}>
              <button type="button">
                <img src={po} alt="Logout" />
              </button>
            </Link>
          </div>
        </div>
      </aside>

      <section className="full_screen" style={{ marginLeft: "70px" }}>
        <Container>
          <h1>Column Utilization Dashboard</h1>
          <Row>
            <Col md={3}>
              <h4>Filters</h4>
              <Form.Group>
                <Form.Label>Project</Form.Label>
                <Select
                  options={projectOptions}
                  value={project}
                  onChange={setProject}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Sample Type</Form.Label>
                <Select
                  options={sampleTypeOptions}
                  value={sampleType}
                  onChange={setSampleType}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Method Set</Form.Label>
                <Select
                  options={methodSetOptions}
                  value={methodSet}
                  onChange={setMethodSet}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>X Column</Form.Label>
                <Select
                  options={getColumnOptions()}
                  value={xColumn}
                  onChange={setXColumn}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Y Column</Form.Label>
                <Select
                  options={getColumnOptions()}
                  value={yColumn}
                  onChange={setYColumn}
                />
              </Form.Group>
              <br></br>
              <Button
                variant="secondary"
                onClick={handleReset}
                style={{ backgroundColor: "#463E96" }}
              >
                Reset
              </Button>
            </Col>
            <Col md={9}>
              <h4>Custom Plot</h4>
              <Row>
                <div style={{ overflowX: 'auto' }}>
                  <Scatter data={getChartData(xColumn?.value, yColumn?.value)} options={scatterChartOptions} />
                </div>
              </Row>
              </Col>
              <Row>
                <h4>Data Preview</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ width: '100%', minWidth: '600px' }}>
                    <thead>
                      <tr>
                        {data.length && Object.keys(data[0,5]).map(col => <th key={col}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.slice(0, 5).map((row, index) => (
                        <tr key={index}>
                          {Object.keys(row).map((col, idx) => <td key={idx}>{row[col]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Row>
            
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Column_Dashboard1;
