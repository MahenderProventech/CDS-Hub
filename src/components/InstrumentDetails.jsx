import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
 
// Import your images
import po from '../img/po.svg';
import dash from "../img/dashboard.png";
import HplcLogList from "../img/hplc_loglist.png";
import search from "../img/search.png";
import report from "../img/report.png";
import usermanagement from "../img/usermanagement.png";
 
const InstrumentDetails = () => {
  const { instrument_No } = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const instrument_No_forApi = instrument_No.replace(/\_/g, '/');


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace <InstrumentId> with instrument_No
        const response = await axios.get(`http://localhost:58747/api/DetailsOfInstrumentId/GetDetailsOfInstrumentIdDetails?InstrumentId=${instrument_No_forApi}`);
        const data = response.data;
       
        // Set the table headers and data
        if (data && data.length > 0) {
          // Assuming the first item contains the headers
          setTableHeaders(Object.keys(data[0]));
          setFilteredData(data);
        }
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };
 
    fetchData();
  }, [instrument_No_forApi]);
 
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
 
  const pagesToShow = [];
  if (totalPages > 1) {
    if (!isFirstPage) pagesToShow.push(currentPage - 1);
    pagesToShow.push(currentPage);
    if (!isLastPage) pagesToShow.push(currentPage + 1);
  }
 
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
                <img src={report} alt="Audit Trail" title="Audit Trail" />
                <p>Audit Trail</p>
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
      <section className="full_screen" style={{ backgroundColor: "#e9ecef" ,height:"100vh"}}>
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb cooseText mb-2">
              <li className="breadcrumb-item">
                <Link to={"/home/HPLCLog_List"}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Details for Instrument Number: {instrument_No_forApi}
              </li>
            </ol>
          </nav>
          <div className="cus-Table table-responsive">
            <table className="table table-bordered" id="example">
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index} className="text-center">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map((header, headerIndex) => (
                      <td key={headerIndex} className="text-center">
                        {row[header] !== null ? row[header] : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          <div className="row">
            <div className="col-sm-12">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${isFirstPage ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                  </li>
                  {pagesToShow.map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                  ))}
                  <li className={`page-item ${isLastPage ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
 
export default InstrumentDetails;
 
 