import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import { Scatter } from "react-chartjs-2";
import Modal from "react-modal";
import Chart from "chart.js/auto"; // Updated import for Chart.js
import zoomPlugin from "chartjs-plugin-zoom";
import dash from "../img/dashboard.png";
import HplcLogList from "../img/hplc_loglist.png";
import search from "../img/search.png";
import report from "../img/report.png";
import usermanagement from "../img/usermanagement.png";
import po from "../img/po.svg";
import { Link } from "react-router-dom";
import "./Column_Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalIsOpen, setModalIsOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:58747/api/Peaks/GetPeaksDetails"
        );
        const result = await response.json();
        console.log("Fetched data:", result);

        if (Array.isArray(result.item2)) {
          const fetchedData = result.item2;
          setData(fetchedData);

          // Generate options for select components
          const projects = [
            ...new Set(fetchedData.map((row) => row["product_Name"])),
          ];
          const sampleTypes = [
            ...new Set(fetchedData.map((row) => row["peakType"])),
          ];
          const methodSets = [
            ...new Set(fetchedData.map((row) => row["test_Name"])),
          ];

          console.log("Project options:", projects);
          console.log("Sample Type options:", sampleTypes);
          console.log("Method Set options:", methodSets);

          setProjectOptions([
            { value: "All", label: "All" },
            ...projects.map((opt) => ({ value: opt, label: opt })),
          ]);
          setSampleTypeOptions([
            { value: "All", label: "All" },
            ...sampleTypes.map((opt) => ({ value: opt, label: opt })),
          ]);
          setMethodSetOptions([
            { value: "All", label: "All" },
            ...methodSets.map((opt) => ({ value: opt, label: opt })),
          ]);
          setFilteredData(fetchedData);
        } else {
          console.error(
            "Fetched data does not contain the expected array:",
            result
          );
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

    if (project && project.value !== "All")
      filtered = filtered.filter(
        (row) => row["product_Name"] === project.value
      );
    if (sampleType && sampleType.value !== "All")
      filtered = filtered.filter((row) => row["peakType"] === sampleType.value);
    if (methodSet && methodSet.value !== "All")
      filtered = filtered.filter((row) => row["test_Name"] === methodSet.value);

    setFilteredData(filtered);
  }, [project, sampleType, methodSet, data]);

  const getColumnOptions = () => {
    return data.length
      ? Object.keys(data[0]).map((col) => ({ value: col, label: col }))
      : [];
  };

  const getChartData = (xCol, yCol) => {
    if (!xCol || !yCol) return { datasets: [] };

    // Prepare data for the scatter plot
    const groupedData = filteredData.reduce((acc, row) => {
      const instrument = row["instrument_No"];
      if (!acc[instrument]) {
        acc[instrument] = {
          x: [],
          y: [],
          label: `${instrument}`,
          color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
        };
      }
      acc[instrument].x.push(row[xCol]);
      acc[instrument].y.push(row[yCol]);
      return acc;
    }, {});

    console.log("Grouped Data:", groupedData);

    const datasets = Object.values(groupedData).map((group) => ({
      label: group.label,
      data: group.x.map((x, index) => ({
        x,
        y: group.y[index],
        instrument: group.label,
      })),
      backgroundColor: group.color,
    }));

    return { datasets };
  };
  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const scatterChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const { dataset } = tooltipItems[0];
            const instrument =
              dataset.data[tooltipItems[0].dataIndex].instrument;
            return [`Instrument: ${instrument}`];
          },
          label: (tooltipItem) => {
            const { raw } = tooltipItem;
            const xValue = raw.x;
            const yValue = raw.y;
            return [
              `${xColumn ? xColumn.label : ""}: ${xValue}`,
              `${yColumn ? yColumn.label : ""}: ${yValue}`,
            ];
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xColumn ? xColumn.label : "",
        },
        type: isNaN(filteredData[0]?.[xColumn?.value]) ? "category" : "linear",
        position: "bottom",
        grid: {
          display: false,
        },
        ticks: {
          callback: (value) => {
            if (typeof value === "number") {
              return value.toLocaleString();
            }
            return value;
          },
        },
        ...(isNaN(filteredData[0]?.[xColumn?.value])
          ? {
              // Handle categorical data
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 0,
              },
              labels: xColumn
                ? Array.from(
                    new Set(filteredData.map((row) => row[xColumn.value]))
                  )
                : [],
            }
          : {}),
      },
      y: {
        title: {
          display: true,
          text: yColumn ? yColumn.label : "",
        },
        type: isNaN(filteredData[0]?.[yColumn?.value]) ? "category" : "linear",
        grid: {
          display: false,
        },
        ticks: {
          callback: (value) => {
            if (typeof value === "number") {
              return value.toLocaleString();
            }
            return value;
          },
          maxTicksLimit: 10, // Adjust this value to control the number of ticks
          padding: 10, // Increase padding to avoid overlap
        },
        ...(isNaN(filteredData[0]?.[yColumn?.value])
          ? {
              // Handle categorical data
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 0,
              },
              labels: yColumn
                ? Array.from(
                    new Set(filteredData.map((row) => row[yColumn.value]))
                  )
                : [],
            }
          : {}),
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
  };
  

  const handleReset = () => {
    setProject(null);
    setSampleType(null);
    setMethodSet(null);
    setXColumn(null);
    setYColumn(null);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div style={{ marginLeft: "14px" }}>
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
            <Link to={"/home/HPLC_Dashboard1"}>
              <button type="button">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcAe9JDEiBrf_rn_mUYo5F-_KCMZWKCkyL2Q&s" alt="HPLCDashboard1" title="HPLCDashboard1" />
                <p>Analysis</p>
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

      <section className="full_screen" style={{ marginLeft: "70px" }}>
        <Container>
          <h2>HPLC Utilization Dashboard</h2>
          <br></br>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label><b>Project</b></Form.Label>
                <Select
                  options={projectOptions}
                  value={project}
                  onChange={setProject}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label><b>Sample Type</b></Form.Label>
                <Select
                  options={sampleTypeOptions}
                  value={sampleType}
                  onChange={setSampleType}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label><b>Method Set</b></Form.Label>
                <Select
                  options={methodSetOptions}
                  value={methodSet}
                  onChange={setMethodSet}
                />
              </Form.Group>
            </Col>
            <br></br>
            <br></br>

            <Col md={4}>
              <Form.Group>
                <Form.Label><b>X Column</b></Form.Label>
                <span style={{ color: "red" }}>*</span>
                <Select
                  options={getColumnOptions()}
                  value={xColumn}
                  onChange={setXColumn}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label><b>Y Column</b></Form.Label>
                <span style={{ color: "red" }}>*</span>
                <Select
                  options={getColumnOptions()}
                  value={yColumn}
                  onChange={setYColumn}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button
                variant="secondary"
                onClick={handleReset}
                style={{ backgroundColor: "#463E96", marginTop: "25px" }}
              >
                Reset
              </Button>
            </Col>
          </Row>
          <br></br>
          <br></br>
          <Col md={12}>
            <h5>Custom Plot</h5>
            <Button
              onClick={openModal}
              style={{ backgroundColor: "#463E96", color: "white", marginLeft:"1000px" }}
            >
              Zoom
            </Button>
            <Row>
              <div style={{ overflowX: "auto",height: "800px" }}>
                <Scatter
                  data={getChartData(xColumn?.value, yColumn?.value)}
                  options={scatterChartOptions}
                />
              </div>
            </Row>
          </Col>
          <Row>
            <h4>Data Preview</h4>
            <div style={{ overflowX: "auto" }}>
              <div style={{ width: "100px" }}>
                <Form.Group>
                  <Form.Label>Rows per Page</Form.Label>
                  <Form.Control
                    as="select"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Form.Control>
                </Form.Group>
                <br></br>
              </div>
              <table
                className="table"
                style={{ width: "100%", minWidth: "600px" }}
              >
                <thead>
                  <tr>
                    {data.length &&
                      Object.keys(data[0]).map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().map((row, index) => (
                    <tr key={index}>
                      {Object.keys(row).map((col, idx) => (
                        <td key={idx}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <Button onClick={handleFirstPage} disabled={isFirstPage}>
                  First
                </Button>

                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={isFirstPage}
                >
                  Previous
                </Button>

                {/* Display the previous page if it's not the first page */}
                {!isFirstPage && (
                  <Button onClick={() => handlePageChange(currentPage - 1)}>
                    {currentPage - 1}
                  </Button>
                )}

                {/* Display the current page */}
                <Button onClick={() => handlePageChange(currentPage)} active>
                  {currentPage}
                </Button>

                {/* Display the next page if it's not the last page */}
                {!isLastPage && (
                  <Button onClick={() => handlePageChange(currentPage + 1)}>
                    {currentPage + 1}
                  </Button>
                )}

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={isLastPage}
                >
                  Next
                </Button>

                <Button onClick={handleLastPage} disabled={isLastPage}>
                  Last
                </Button>
              </div>
            </div>
          </Row>
        </Container>
      </section>
      <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          top: "10%",
          left: "10%",
          right: "2%",
          bottom: "2%",
          padding: "5px",
        },
      }}
      ariaHideApp={false}
    >
      <Button onClick={closeModal} style={{ position: "absolute", top: "10px", right: "10px" }}>
        Close
      </Button>
      <h2>Zoomed Plot</h2>
      <div style={{ height: "100%", width: "100%", position: "relative" }}>
        <Scatter
          data={getChartData(xColumn?.value, yColumn?.value)}
          options={scatterChartOptions}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </Modal>
  
    </div>
  );
};

export default Column_Dashboard1;
