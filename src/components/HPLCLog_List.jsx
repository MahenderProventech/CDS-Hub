import React, { useState, useEffect } from "react";
import dash from "../img/dashboard.png";
import HplcLogList from "../img/hplc_loglist.png";
import search from "../img/search.png";
import report from "../img/report.png";
import usermanagement from "../img/usermanagement.png";
import { Link } from "react-router-dom";
import './print.css';
import po from '../img/po.svg';



const HPLCLog_List = () => {
  const [peaksData, setPeaksData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [productName, setProductName] = useState("");
  const [batchNumbers, setBatchNumbers] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:58747/api/Peaks/GetPeaksDetails"
        );
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data

        if (Array.isArray(data.item2)) {
          setPeaksData(data.item2);
          setFilteredData(data.item2); // Initialize filteredData with fetched data
          const uniqueInstruments = [
            ...new Set(data.item2.map((item) => item.instrument_No)),
          ];
          setInstruments(uniqueInstruments);
        } else {
          console.error(
            "Fetched data does not contain the expected array:",
            data
          );
        }
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = peaksData.filter((peak) => {
      const peakDate = new Date(peak.sampleSetStartDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      return (
        (!from || peakDate >= from) &&
        (!to || peakDate <= to) &&
        (!instrumentId || peak.instrument_No === instrumentId) &&
        (!productName || peak.product_Name.includes(productName)) &&
        (!batchNumbers || peak.batch_No.includes(batchNumbers))
      );
    });

    setFilteredData(filtered);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
  
    // Create the CSS styles to be included in the print window
    const printStyles = `
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .table th {
          background-color: #463E96;
          color: white;
        }
        .thead-dark th {
          background-color: #463E96;
          color: white;
        }
      </style>
    `;
  
    // Write the content to the print window
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write(printStyles); // Inject CSS styles
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>HPLC Log List</h1>');
    printWindow.document.write(document.querySelector('.cus-Table').outerHTML); // Use outerHTML for full table structure
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  
    printWindow.focus();
    printWindow.print();
  };
  
  

  const handleExport = () => {
    const csvContent = [
      [
        "S.No",
        "Date",
        "AR Number",
        "Instrument Number",
        "Product Name",
        "Test Name",
        "Column Number",
        "Batch no.",
        "Injection Id",
        "Sample Set Start Date",
        "Sample Set Finish Date",
      ],
      ...filteredData.map((peak, index) => [
        index + 1,
        peak.sampleSetStartDate,
        peak.a_R_No,
        peak.instrument_No,
        peak.product_Name,
        peak.test_Name,
        peak.column_No,
        peak.batch_No,
        peak.injectionId,
        peak.sampleSetStartDate
          ? new Date(peak.sampleSetStartDate).toLocaleDateString()
          : "NULL",
        peak.sampleSetFinishDate
          ? new Date(peak.sampleSetFinishDate).toLocaleDateString()
          : "NULL",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "HPLCLog_List.csv";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
    <aside className="col-md-1 p_sideNav">
        <div className="main">
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


      <section className="full_screen" style={{ backgroundColor: "#e9ecef" }}>
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb cooseText mb-2">
              <li className="breadcrumb-item active" aria-current="page">
                HplcLog Table
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div
                className="card mt-3"
                style={{ padding: "1.5rem", width: "98%", marginLeft: "5px" }}
              >
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
                      <label htmlFor="instrumentId" className="form-label">
                        <b>Instrument ID</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        className="form-select"
                        id="instrumentId"
                        value={instrumentId}
                        onChange={(e) => setInstrumentId(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {instruments.map((instrument) => (
                          <option key={instrument} value={instrument}>
                            {instrument}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="mb-3">
                      <label htmlFor="productName" className="form-label">
                        <b>Product Name</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="mb-3">
                      <label htmlFor="batchNumbers" className="form-label">
                        <b>Batch Numbers</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="batchNumbers"
                        value={batchNumbers}
                        onChange={(e) => setBatchNumbers(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-3" style={{ marginTop: "28px" }}>
                    <button
                      className="btn btn-primary ms-3 MinW200 mt29"
                      onClick={handleSearch}
                    >
                      Search <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="card mt-3"
                style={{ padding: "1.5rem", width: "98%", marginLeft: "5px" }}
              >
                <div className="cus-Table table-responsive">
                  <table className="table table-bordered" id="example">
                    <thead>
                      <tr>
                        <th width="" className="text-center">
                          S.No
                        </th>
                        <th className="text-center">Date Acquired</th>
                        <th className="text-center">Acquired By</th>
                        <th className="text-center">Instrument Number</th>
                        <th className="text-center">Product Name</th>
                        <th className="text-center">Test Name</th>
                        <th className="text-center">AR Number</th>
                        <th className="text-center">Column Number</th>
                        <th className="text-center">Batch no.</th>
                        <th className="text-center">Injection Id</th>
                        <th className="text-center">Sample Set Start Date</th>
                        <th className="text-center">Sample Set Finish Date</th>
                        <th className="text-center">No.of Injections</th>
                        <th className="text-center">Runtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((peak, index) => (
                        <tr key={peak.ID}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {peak.dateAcquired}
                          </td>
                          <td className="text-center">{peak.sampleSetAcquiredBy}</td>
                          <td className="text-center">{peak.instrument_No}</td>
                          <td className="text-center">{peak.product_Name}</td>
                          <td className="text-center">{peak.test_Name}</td>
                          <td className="text-center">{peak.a_R_No}</td>
                          <td className="text-center">{peak.column_No}</td>
                          <td className="text-center">{peak.batch_No}</td>
                          <td className="text-center">{peak.injectionId}</td>
                          <td className="text-center">
                            {peak.sampleSetStartDate
                              ? new Date(
                                  peak.sampleSetStartDate
                                ).toLocaleDateString()
                              : "NULL"}
                          </td>
                          <td className="text-center">
                            {peak.sampleSetFinishDate
                              ? new Date(
                                  peak.sampleSetFinishDate
                                ).toLocaleDateString()
                              : "NULL"}
                          </td>
                          <td className="text-center"></td>
                          <td className="text-center">10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="d-flex justify-content-end align-items-center my-3"
                style={{ marginRight: "20px" }}
              >
                <button className="btn btn-outline-dark me-2" onClick={handlePrint}>
                  Print
                </button>
                <button className="btn btn-primary" onClick={handleExport}>
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="modal fade logOutModal" id="logOutModal" tabIndex="-1">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h3 className="pt-5">Are you sure want to Logout?</h3>
              <div style={{ textAlign: "center" }} className="py-4">
                <button
                  className="btn btn-outline-dark mx-2"
                  data-bs-dismiss="modal"
                >
                  No
                </button>
                <button
                  className="btn btn-primary mx-2"
                  data-bs-dismiss="modal"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HPLCLog_List;
 