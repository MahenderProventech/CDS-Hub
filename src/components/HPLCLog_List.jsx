import React, { useState, useEffect } from "react";
import dash from "../img/dashboard.png";
import HplcLogList from "../img/hplc_loglist.png";
import search from "../img/search.png";
import report from "../img/report.png";
import usermanagement from "../img/usermanagement.png";
import { Link } from "react-router-dom";
import "./print.css";
import po from "../img/po.svg";
import "./Column_Dashboard.css";
import axios from "axios";

const HPLCLog_List = () => {
  const [processPeaksDataData, setProcessPeaksDataData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [productName, setProductName] = useState("");
  const [batchNumbers, setBatchNumbers] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productNames, setProductNames] = useState([]);
  const [validColumns, setValidColumns] = useState([]);
  const [peaksData, setPeaksData] = useState([]);
  const [hasSampleSetId, setHasSampleSetId] = useState(false);
  const [filters, setFilters] = useState([]); // To store dynamically fetched filter fields
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    setLoading(true);

    // Fetch valid column headers
    const fetchValidColumns = axios
      .get("http://localhost:58747/api/PopulateHPLCUsage/GetSavedHplcDetails")
      .then((response) => {
        const columns = response.data.map((item) => item.nameOfTheColumn);
        return columns;
      })
      .catch((error) => {
        console.error("Error fetching valid columns:", error);
        return [];
      });

    // Fetch actual data
    const fetchData = axios
      .get(
        "http://localhost:58747/api/ProcessPeaksData/GetProcessPeaksDataDetails"
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return [];
      });

    // Once both requests are completed, filter the data
    Promise.all([fetchValidColumns, fetchData])
      .then(([validColumns, data]) => {
        if (validColumns.length && data.length) {
          // Check if any data row contains sampleSetId
          const hasSampleSetId = data.some(
            (row) => row.sampleSetId !== undefined
          );
          setHasSampleSetId(hasSampleSetId);

          // Filter the data to only include the valid columns
          const filteredData = data.map((row) => {
            let filteredRow = {};
            validColumns.forEach((column) => {
              if (column in row) {
                filteredRow[column] = row[column];
              }
            });
            return filteredRow;
          });

          // Set state
          setProcessPeaksDataData(data);
          setValidColumns(validColumns);
          setFilteredData(filteredData);
        } else {
          console.warn("No valid columns or data found.");
        }
      })
      .catch((error) => {
        console.error("Error processing data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Fetch filter details from the API
    axios
      .get("http://localhost:58747/api/PopulateHPLCUsage/GetFilterHplcDetails")
      .then((response) => {
        console.log("API Response:", response.data); // Debugging: Check the API response
        setFilters(response.data); // Assuming the API response is an array of filter details
      })
      .catch((error) => {
        console.error("Error fetching filter details:", error);
      });
  }, []);

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: value,
    });
  };
  const [data, setData] = useState([]);

  const handleSearch = () => {
    const filtered = processPeaksDataData.filter((peak) => {
      const peakDate = new Date(peak.sampleSetStartDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
  
      // Convert instrument_No for comparison
      const instrumentNoForComparison = instrumentId.replace(/_/g, '/');
  
      // Check for filters matching
      const filterMatch = Object.keys(selectedFilters).every((filterName) => {
        const filterValue = selectedFilters[filterName];
        return !filterValue || (filterName === 'instrument_No' 
          ? peak[filterName]?.toString() === filterValue.replace(/_/g, '/')
          : peak[filterName]?.toString() === filterValue);
      });
  
      return (
        (!from || peakDate >= from) && (!to || peakDate <= to) && filterMatch
      );
    });
  
    setFilteredData(filtered);
  };
  
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSelectedFilters({});
    setFilteredData(processPeaksDataData); // Reset filtered data
  };

  const handlePrint = () => {
    // Create a hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Get iframe document
    const iframeDoc = iframe.contentWindow.document;

    // Create CSS styles to be included in the iframe
    const printStyles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
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
        @media print {
          @page {
            size: A4 landscape; /* Change to landscape to increase width */
            margin: 10mm;
          }
          body {
            margin: 0;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          .table th, .table td {
            page-break-inside: avoid;
          }
        }
      </style>
    `;

    // Write content to the iframe document
    iframeDoc.open();
    iframeDoc.write("<html><head><title>Print</title>");
    iframeDoc.write(printStyles); // Inject CSS styles
    iframeDoc.write("</head><body>");
    iframeDoc.write("<h1>HPLC Log List</h1>");

    // Add table headers
    iframeDoc.write(`
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="text-center">S.No</th>
            ${validColumns
              .map((column) => `<th class="text-center">${column}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
    `);

    filteredData.forEach((peak, index) => {
      iframeDoc.write("<tr>");
      iframeDoc.write(`<td class="text-center">${index + 1}</td>`);
      validColumns.forEach((column) => {
        iframeDoc.write(
          `<td class="text-center">${peak[column] || "NULL"}</td>`
        );
      });
      iframeDoc.write("</tr>");
    });

    iframeDoc.write("</tbody></table>");
    iframeDoc.write("</body></html>");
    iframeDoc.close();

    // Print the iframe content
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove iframe after printing
    document.body.removeChild(iframe);
  };

  const handleExport = () => {
    const csvContent = [
      ["S.No", ...validColumns],
      ...filteredData.map((peak, index) => [
        index + 1,
        ...validColumns.map((column) => peak[column] || "NULL"),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "HPLC_LogList.csv";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Check if the current page is the first or the last page
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Determine which pages to display
  const pagesToShow = [];
  if (totalPages > 1) {
    if (!isFirstPage) pagesToShow.push(currentPage - 1);
    pagesToShow.push(currentPage);
    if (!isLastPage) pagesToShow.push(currentPage + 1);
  }

  const getUniqueFilterOptions = (filterName) => {
    const uniqueValues = new Set();
    processPeaksDataData.forEach((item) => {
      if (item[filterName]) {
        uniqueValues.add(item[filterName]);
      }
    });
    return Array.from(uniqueValues);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateTimeString; // Return as-is if it's not a valid date
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const isDateTimeString = (value) => {
    // Ensure the value is a string
    if (typeof value !== "string") {
      return false;
    }

    // Check if the value contains a 'T' and is a valid date
    const date = new Date(value);
    return !isNaN(date.getTime()) && value.includes("T");
  };

  const handleValues = (values) => {
    // Check if values is defined and is a string, otherwise return a placeholder
    if (typeof values === "string") {
      return values.split(",").map((val, i) => (
        <div key={i}>
          {val}
          {i < values.split(",").length - 1 && ", "}
        </div>
      ));
    }
    return <div>No Data</div>;
  };

  return (
    <div>
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
                <img src={dash} alt="HPLCDashboard1" title="HPLCDashboard1" />
                <p>Analysis</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Dashboard"}>
              <button type="button">
                <img src={dash} alt="HPLCDashboard" title="HPLCDashboard" />
                <p>Dashboard</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLCLog_List"}>
              <button type="button">
                <img
                  src={HplcLogList}
                  alt="HPLC Log List"
                  title="HPLC Log List"
                />
                <p>HPLC Log List</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_Search"}>
              <button type="button">
                <img src={search} alt="Search" title="Search" />
                <p>Search</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_AuditTrail"}>
              <button type="button">
                <img src={report} alt="Audit Trial" title="Audit Trial" />
                <p>Audit Trial</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/HPLC_UserManagement"}>
              <button type="button">
                <img
                  src={usermanagement}
                  alt="User Management"
                  title="User Management"
                />
                <p>User Management</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend" style={{ marginTop: "10px" }}>
            <Link to={"/"}>
              <button type="button" title="Logout">
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
                HPLC Usage Log
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
                  {filters.length > 0 ? (
                    filters.map((filter, index) => (
                      <div className="col-sm-3" key={index}>
                        <div className="mb-3">
                          <label
                            htmlFor={filter.filterName}
                            className="form-label"
                          >
                            <b>{filter.filterName}</b>
                          </label>

                          {/* Input field combined with dropdown */}

                          <input
                            list={`options-${filter.filterName}`} // Use a datalist for dropdown options
                            className="form-control"
                            id={filter.filterName}
                            value={selectedFilters[filter.filterName] || ""}
                            onChange={(e) =>
                              handleFilterChange(
                                filter.filterName,
                                e.target.value
                              )
                            }
                            placeholder="Enter or select a value"
                          />

                          {/* Datalist to show dropdown options */}

                          <datalist id={`options-${filter.filterName}`}>
                            {getUniqueFilterOptions(filter.filterName).map(
                              (option, idx) => (
                                <option key={idx} value={option}>
                                  {option}
                                </option>
                              )
                            )}
                          </datalist>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-sm-12">
                      <p>No filters available.</p>
                    </div>
                  )}

                  <div className="col-sm-12">
                    <button className="btn btn-primary" onClick={handleSearch}>
                      Search
                    </button>
                    <button
                      className="btn btn-secondary ml-2"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div
                  className="card mt-3"
                  style={{ padding: "1.5rem", width: "98%", marginLeft: "5px" }}
                >
                  <div className="row">
                    <div className="col-sm-2">
                      <div className="mb-2">
                        <label htmlFor="rowsPerPage" className="form-label">
                          <b>Rows Per Page</b>
                        </label>
                        <select
                          className="form-select"
                          id="rowsPerPage"
                          value={rowsPerPage}
                          onChange={(e) =>
                            setRowsPerPage(parseInt(e.target.value))
                          }
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="cus-Table table-responsive">
  <table>
    <thead>
      <tr>
        {validColumns.map((column) => (
          <th key={column}>{column}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {filteredData
        .slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        )
        .map((row, index) => (
          <tr key={index}>
            {validColumns.map((column) => (
              <td key={column}>
                {column === "sampleSetId" && row[column] ? (
                  <Link
                    to={`/home/HPLCLog_List/${row[column]}`}
                    className="link-primary"
                  >
                    {row[column]}
                  </Link>
                ) : column === "instrument_No" && row[column] ? (
                  <Link
  to={`/home/instrumentdetails/${row[column].replace(/\//g, '_')}`}
  className="link-primary"
>
  {row[column]}
</Link>

                ) : isDateTimeString(row[column]) ? (
                  formatDateTime(row[column])
                ) : (
                  row[column]
                )}
              </td>
            ))}
          </tr>
        ))}
    </tbody>
  </table>
</div>

                </div>
              </div>
              <div>
                <div>
                  <br></br>
                  <div className="row">
                    <div className="col-sm-12">
                      <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                          <li
                            className={`page-item ${
                              isFirstPage ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                !isFirstPage && handlePageChange(1)
                              }
                            >
                              First
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              isFirstPage ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                !isFirstPage &&
                                handlePageChange(currentPage - 1)
                              }
                            >
                              Previous
                            </button>
                          </li>
                          {pagesToShow.map((pageNumber) => (
                            <li
                              key={pageNumber}
                              className={`page-item ${
                                currentPage === pageNumber ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              isLastPage ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                !isLastPage && handlePageChange(currentPage + 1)
                              }
                            >
                              Next
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              isLastPage ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                !isLastPage && handlePageChange(totalPages)
                              }
                            >
                              Last
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="d-flex justify-content-end align-items-center my-3"
                style={{ marginRight: "20px" }}
              >
                <button
                  className="btn btn-outline-dark me-2"
                  onClick={handlePrint}
                >
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
    </div>
  );
};

export default HPLCLog_List;
