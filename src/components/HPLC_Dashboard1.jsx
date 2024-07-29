import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Select from 'react-select';
import { Bar, Scatter } from 'react-chartjs-2';
import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';
import po from '../img/po.svg';
import { Link } from 'react-router-dom';

const HPLC_Dashboard1 = () => {
  const [data, setData] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [sampleTypeOptions, setSampleTypeOptions] = useState([]);
  const [methodSetOptions, setMethodSetOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [project, setProject] = useState('All');
  const [sampleType, setSampleType] = useState('All');
  const [methodSet, setMethodSet] = useState('All');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:58747/api/Peaks/GetPeaksDetails");
        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data.item2)) {
          setData(data.item2);
          setProjectOptions(['All', ...new Set(data.item2.map(row => row['product_Name']))]);
          setSampleTypeOptions(['All', ...new Set(data.item2.map(row => row['peakType']))]);
          setMethodSetOptions(['All', ...new Set(data.item2.map(row => row['test_Name']))]);
          setFilteredData(data.item2);
          setXColumn(Object.keys(data.item2[0])[0]);
          setYColumn(Object.keys(data.item2[0])[1]);
        } else {
          console.error("Fetched data does not contain the expected array:", data);
        }
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (project !== 'All') filtered = filtered.filter(row => row['product_Name'] === project);
    if (sampleType !== 'All') filtered = filtered.filter(row => row['peakType'] === sampleType);
    if (methodSet !== 'All') filtered = filtered.filter(row => row['test_Name'] === methodSet);

    setFilteredData(filtered);
  }, [project, sampleType, methodSet, data]);

  const getColumnOptions = () => {
    return data.length ? Object.keys(data[0]).map(col => ({ value: col, label: col })) : [];
  };

  const convertToNumeric = (values) => {
    const uniqueValues = [...new Set(values)];
    const valueMap = uniqueValues.reduce((acc, value, index) => {
      acc[value] = index + 1; // Start index from 1 to avoid 0
      return acc;
    }, {});

    return values.map(value => valueMap[value]);
  };

  const getChartData = (xCol, yCol) => {
    const isXNumeric = data.every(row => !isNaN(row[xCol]));
    const isYNumeric = data.every(row => !isNaN(row[yCol]));

    const xValues = isXNumeric ? filteredData.map(row => row[xCol]) : convertToNumeric(filteredData.map(row => row[xCol]));
    const yValues = isYNumeric ? filteredData.map(row => row[yCol]) : convertToNumeric(filteredData.map(row => row[yCol]));

    const groupedData = filteredData.reduce((acc, row, index) => {
      const instrument = row['instrument_No'];
      if (!acc[instrument]) {
        acc[instrument] = { x: [], y: [], label: `Instrument ${instrument}`, color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)` };
      }
      acc[instrument].x.push(xValues[index]);
      acc[instrument].y.push(yValues[index]);
      return acc;
    }, {});

    const datasets = Object.values(groupedData).map(group => ({
      label: group.label,
      data: group.x.map((x, index) => ({ x, y: group.y[index], instrument: group.label })),
      backgroundColor: group.color,
    }));

    return {
      datasets
    };
  };

  const getBarChartData = (column) => {
    const counts = filteredData.reduce((acc, row) => {
      acc[row[column]] = (acc[row[column]] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: `${column} Status`,
        data: Object.values(counts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
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
              `${xColumn}: ${xValue}`,
              `${yColumn}: ${yValue}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xColumn
        }
      },
      y: {
        title: {
          display: true,
          text: yColumn
        }
      }
    }
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
        }
      },
      y: {
        title: {
          display: true,
          text: yText
        }
      }
    }
  });

  return (
    <div style={{ marginLeft: '14px' }}>
      <aside className="col-md-1 p_sideNav">
        <div className="main">
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Dashboard1"}>
              <button type="button">
                <img src={dash} alt="Dashboard1" title="Dashboard1" />
                <p>Dashboard 1</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Dashboard"}>
              <button type="button">
                <img src={dash} alt="Dashboard" title="Dashboard" />
                <p>Dashboard</p>
              </button>
            </Link>
          </div><br />
          <div className="btn-group dropend">
            <Link to={"/home/ColumnLog_List"}>
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

      {/* Main Content */}
      <section className="full_screen" style={{ marginLeft: "70px" }}>
        <Container>
          <h1>HPLC Utilization Dashboard</h1>
          <Row>
            <Col md={3}>
              <h4>Filters</h4>
              <Form.Group>
                <Form.Label>Project</Form.Label>
                <Select options={projectOptions.map(opt => ({ value: opt, label: opt }))}
                        onChange={opt => setProject(opt.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Sample Type</Form.Label>
                <Select options={sampleTypeOptions.map(opt => ({ value: opt, label: opt }))}
                        onChange={opt => setSampleType(opt.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Method Set</Form.Label>
                <Select options={methodSetOptions.map(opt => ({ value: opt, label: opt }))}
                        onChange={opt => setMethodSet(opt.value)} />
              </Form.Group>
            </Col>
            <Col md={9}>
              <h4>Custom Plot</h4>
              <Form.Group>
                <Form.Label>Select X-axis</Form.Label>
                <Select options={getColumnOptions()} onChange={opt => setXColumn(opt.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Select Y-axis</Form.Label>
                <Select options={getColumnOptions()} onChange={opt => setYColumn(opt.value)} />
              </Form.Group>
              <Scatter data={getChartData(xColumn, yColumn)} options={scatterChartOptions} />

              <h4>Injection Status</h4>
              <Bar data={getBarChartData('intType')} options={barChartOptions('Injection Status', 'Status Type', 'Count')} />

              <h4>Processing Status</h4>
              <Bar data={getBarChartData('peakType')} options={barChartOptions('Processing Status', 'Status Type', 'Count')} />

              <h4>Integration Status</h4>
              <Bar data={getBarChartData('intType')} options={barChartOptions('Integration Status', 'Status Type', 'Count')} />

              <h4>Sample Set</h4>
              <Bar data={getBarChartData('sampleSetStartDate')} options={{ ...barChartOptions('Sample Set', 'Date', 'Count'), indexAxis: 'y' }} />

              <h4>Data Preview</h4>
              <table className="table">
                <thead>
                  <tr>
                    {data.length && Object.keys(data[0]).map(col => <th key={col}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 5).map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HPLC_Dashboard1;
