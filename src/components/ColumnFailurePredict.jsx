import React, { useState, useEffect } from 'react';
import http from './Http';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import dash from '../img/dashboard.png';
import HplcLogList from '../img/hplc_loglist.png';
import search from '../img/search.png';
import report from '../img/report.png';
import usermanagement from '../img/usermanagement.png';

const ColumnFailurePredict = () => {
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  const [SampleSetName, setSampleSetName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [InjectionId, setInjectionId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [productName, setProductName] = useState("");
  const [batchNumbers, setBatchNumbers] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [peaksData, setPeaksData] = useState([]);
  const [sampleSetIDs, setSampleSetIDs] = useState([]);
  const [allInjectionIds, setAllInjectionIds] = useState([]);
  const [column_No, setColumnNo] = useState([]); // Ensures it's initialized as an array
  const [selectedColumn, setSelectedColumn] = useState("");
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await http.get("Peaks/GetPeaksDetails");
      const fetchedData = response.data;

      console.log('Fetched Data:', fetchedData);

      setPeaksData(fetchedData.item2);
      setFilteredData(fetchedData.item2); // Set initial filtered data to all data
      processFilteredData(fetchedData.item2); // Process initial data

      const uniqueColumnNumbers = [...new Set(fetchedData.item2.map(item => item.column_No))].filter(Boolean);
      setColumnNo(uniqueColumnNumbers);
      setSampleSetIDs([...new Set(fetchedData.item2.map(item => item.sampleSetId))]);
      setAllInjectionIds([...new Set(fetchedData.item2.map(item => item.injectionId))]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const handleSearch = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
  
    // If no filters are applied, display the full dataset
    if (!from && !to && !InjectionId && !selectedColumn && !SampleSetName) {
      setFilteredData(peaksData);
      processFilteredData(peaksData); // Process and update the table with all data
      setCurrentPage(1);
      return;
    }
  
    // Apply filters if any are set
    const filtered = peaksData.filter((peak) => {
      const peakDate = new Date(peak.sampleSetStartDate);
  
      return (
        // Filter by date range
        (!from || peakDate >= from) &&
        (!to || peakDate <= to) &&
        // Filter by InjectionId
        (!InjectionId || peak.injectionId.toString() === InjectionId.toString()) &&
        // Filter by Column No
        (!selectedColumn || peak.column_No.toString() === selectedColumn.toString()) &&
        // Filter by SampleSetName
        (!SampleSetName || peak.sampleSetId.toString() === SampleSetName.toString())
      );
    });
  
    // Log the filtered data for debugging
    console.log("Filtered Data:", filtered);
  
    // Process and display the filtered data in the table
    processFilteredData(filtered);
  
    // Set filtered data and reset the page
    setFilteredData(filtered);
    setCurrentPage(1);
  };
  
  
  

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setInjectionId("");
    setSelectedColumn("");
    setSampleSetName("");
    setProductName("");
    setBatchNumbers("");
    setFilteredData([]);
    setCurrentPage(1);
  };

  const processFilteredData = (data) => {
    // Filter only the data with sample names starting with 'standard'
    const filteredData = data
      .filter(item => item.sampleName && item.sampleName.toLowerCase().startsWith('standard'))
      .map(item => ({
        ...item,
        SampleSetStartDate: new Date(item.sampleSetStartDate),
        USPPlateCount: parseFloat(item.uspPlateCount),
      }))
      .filter(item => 
        item.sampleSetId && 
        item.injectionId && 
        !isNaN(item.USPPlateCount) && 
        item.SampleSetStartDate
      );
  
    // Sort the data based on sampleSetId and injectionId
    filteredData.sort((a, b) => {
      if (a.sampleSetId === b.sampleSetId) {
        return a.injectionId - b.injectionId;
      }
      return a.sampleSetId - b.sampleSetId;
    });
  
    // Group the processed data by sampleSetId and injectionId
    const groupedData = [];
    filteredData.forEach(item => {
      const existing = groupedData.find(group => 
        group.sampleSetId === item.sampleSetId && 
        group.injectionId === item.injectionId
      );
  
      if (!existing) {
        groupedData.push({
          sampleSetId: item.sampleSetId,
          injectionId: item.injectionId,
          uspPlateCount: item.USPPlateCount,
          injectionDate: item.SampleSetStartDate,
          injectionCount: 1,
          sampleName: item.sampleName,
          name: item.name,
        });
      } else {
        existing.injectionCount += 1;
      }
    });
  
    // Calculate USPPlateCount difference and percentage difference between successive injections
    const result = groupedData.map((item, index, arr) => {
      const prevItem = arr[index - 1] && arr[index - 1].sampleSetId === item.sampleSetId 
        ? arr[index - 1] 
        : null;
      const USPPlateCountDiff = prevItem ? item.uspPlateCount - prevItem.uspPlateCount : 0;
      const PercentageDifference = prevItem ? (USPPlateCountDiff / prevItem.uspPlateCount) * 100 : 0;
  
      return {
        ...item,
        USPPlateCountDiff,
        PercentageDifference,
      };
    });
  
     // console.log('Before filtering invalid USPPlateCount:', filteredData.length);
    // const invalidUSPPlateCountRows = filteredData.filter(item => isNaN(parseFloat(item.uspPlateCount)));
    // console.log('Rows with invalid USPPlateCount:', invalidUSPPlateCountRows.length);
    // console.log('Grouped Data:', groupedData.length);
    // console.log('Filtered Data:', filteredData.length);
    // console.log('Processed Data (after filtering invalid rows):', processedData.length);
    
    console.log('Final Result:', result);
    setResult(result);
    createChartData(result); // Pass filtered data to chart creation
  };
  

const createChartData = (data) => {
  const timeSeries = data.map((item, index) => index + 1);
  const uspPlateCounts = data.map(item => item.uspPlateCount);

  return {
    labels: timeSeries,
    datasets: [
      {
        label: 'USP Plate Count',
        data: uspPlateCounts,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Failure Threshold (4000)',
        data: new Array(timeSeries.length).fill(4000),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderDash: [5, 5],
        fill: false,
      },
    ],
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Injection Number', // Label for the X-axis
          },
        },
        y: {
          title: {
            display: true,
            text: 'USP Plate Count', // Label for the Y-axis
          },
        },
      },
    },
  };
};

const paginateData = () => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  return paginatedData;
};

const predictFailureTime = (data) => {
  const X = data.map((_, index) => index + 1);
  const y = data.map(item => item.uspPlateCount);

  const sumX = X.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = X.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = X.reduce((a, b) => a + b * b, 0);

  const n = X.length;
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predictedFailureTime = (4000 - intercept) / slope;
  return Math.round(predictedFailureTime);
};

const chartData = createChartData(result);
const predictedFailureTime = predictFailureTime(result);


  return (
    <div>
       {/* backgroundColor: "#e9ecef", */}
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
            <Link to={"/home/ColFail"}>
              <button type="button">
                <img src={dash} alt="ColFail" title="ColFail" />
                <p>Analysis of failure</p>
              </button>
            </Link>
          </div><br />
          {/* <div className="btn-group dropend">
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
          </div><br /> */}
        </div>
      </aside>
    <section className="full_screen" style={{ height: "100vh" , marginLeft:"120px"}}>

      <div style={{ marginLeft: "10px", marginRight: "20px" }}>
        <div>
          <h1>Column Failure Prediction</h1>

          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="fromDate" className="form-label">
                  <b>From Date</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="toDate" className="form-label">
                  <b>To Date</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="column_No" className="form-label">
                  <b>Column No</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-select"
                  id="column_No"
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {Array.isArray(column_No) && column_No.length > 0 ? (
                    column_No.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))
                  ) : (
                    <option disabled>No columns available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="SampleSetID" className="form-label">
                  <b>SampleSet ID</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-select"
                  id="SampleSetID"
                  value={SampleSetName}
                  onChange={(e) => setSampleSetName(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {sampleSetIDs.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="InjectionId" className="form-label">
                  <b>Injection ID</b>
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-select"
                  id="InjectionId"
                  value={InjectionId}
                  onChange={(e) => setInjectionId(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {allInjectionIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-3">
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="col-sm-3">
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
  <h2>Column Health Prediction Graph</h2>
  <Line data={chartData} options={chartData.options} />
  {/* <p>
    Predicted time until failure (USP Plate Count &lt; 4000): 
    {predictedFailureTime !== undefined ? predictedFailureTime : 'N/A'} injections
  </p> */}
</div>
<br></br>
<br></br>
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>SampleSet ID</th>
                  <th>Injection ID</th>
                  <th>USP Plate Count</th>
                  <th>Sample Name</th>
                  <th>Chemical Name</th>
                  <th>Injection Count</th>
                  <th>Injection Date</th>
                  <th>Plate Count Diff</th>
                  <th>% Difference</th>
                </tr>
              </thead>
              <tbody>
                {result.length > 0 ? (
                  result.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sampleSetId}</td>
                      <td>{item.injectionId}</td>
                      <td>{item.uspPlateCount}</td>
                      <td>{item.sampleName}</td>
                      <td>{item.name}</td>
                      <td>{item.injectionCount}</td>
                      <td>{item.injectionDate.toLocaleDateString()}</td>
                      <td>{item.USPPlateCountDiff}</td>
                      <td>{item.PercentageDifference.toFixed(2)}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
<br></br>
<br></br>

        </div>
        </div>
    </section>

      </div>
  );
};

export default ColumnFailurePredict;