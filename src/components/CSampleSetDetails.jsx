import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import po from '../img/po.svg';
import dash from "../img/dashboard.png";
import HplcLogList from "../img/hplc_loglist.png";
import search from "../img/search.png";
import report from "../img/report.png";
import usermanagement from "../img/usermanagement.png";
import { Link } from "react-router-dom";

const SampleSetDetails = () => {
  const { sampleSetId } = useParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:58747/api/GetPeaksDetailsBySampleSetId/GetGetPeaksDetailsBySampleSetIdDetails?sampleSetId=${sampleSetId}`);
        const data = response.data;
        setFilteredData(data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };

    fetchData();
  }, [sampleSetId]);

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

  const handleValues = (values) => {
    // Check if values is defined and is a string, otherwise return a placeholder
    if (typeof values === 'string') {
      return values.split(',').map((val, i) => (
        <div key={i}>
          {val}{i < values.split(',').length - 1 && ', '}
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
            <Link to={"/home/Column_Dashboard1"}>
              <button type="button">
                <img src={dash} alt="Dashboard1" title="Dashboard1" />
                <p>Analysis</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_Dashboard"}>
              <button type="button">
                <img src={dash} alt="Dashboard" title="Dashboard" />
                <p>Dashboard</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/ColumnLog_List"}>
              <button type="button">
                <img
                  src={HplcLogList}
                  alt="Column Log List"
                  title="Column Log List"
                />
                <p>Column Log List</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_Search"}>
              <button type="button">
                <img src={search} alt="Search" title="Search" />
                <p>Search</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_AuditTrail"}>
              <button type="button">
                <img src={report} alt="Audit Trial" title="Audit Trial" />
                <p>Audit Trial</p>
              </button>
            </Link>
          </div>
          <br />
          <div className="btn-group dropend">
            <Link to={"/home/Column_UserManagement"}>
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
        </div>
      </aside>
      <section className="full_screen" style={{ backgroundColor: "#e9ecef" }}>
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb cooseText mb-2">
              <li className="breadcrumb-item active" aria-current="page">
                Details for Sample Set ID: {sampleSetId}
              </li>
            </ol>
          </nav>
          <div className="cus-Table table-responsive">
                  <table className="table table-bordered" id="example">
                    <thead>
                      <tr>
                        <th width="" className="text-center">
                          S.No
                        </th>
                        <th className="text-center">Date Acquired</th>                
                        <th className="text-center">Instrument Number</th>
                        <th className="text-center">Product Name</th>
                        <th className="text-center">Sample Set ID</th>
                        <th className="text-center">Column No.</th>
                        <th className="text-center">AR Number</th>
                        <th className="text-center">Batch no.</th>
                        <th className="text-center">Test Name</th>
                        <th className="text-center">Sample Set Start Date</th>
                        <th className="text-center">Sample Set Finish Date</th>
                        <th className="text-center">No.of Injections</th>
                        
                        <th className="text-center">Acquired By</th>
 
                      </tr>
                    </thead>
                    <tbody>
                    {currentData.map((peak, index) => (
                      <tr key={index}>
                        <td className="text-center">{(currentPage - 1) * rowsPerPage + index + 1}</td>  
                          <td className="text-center">
                          {new Date(peak.dateAcquired).toLocaleString()}
                          </td>
                          <td className="text-center">{peak.instrument_No}</td>
                          <td className="text-center">{peak.product_Name}</td>
                          <td className="text-center">{peak.sampleSetId}</td>      
                          <td className="text-center">{peak.column_No}</td>

                          <td className="text-center">{handleValues(peak.a_R_No) }</td>
                          <td className="text-center">{handleValues(peak.batch_No) }</td>
                          <td className="text-center">{peak.test_Name}</td>
                          <td className="text-center">{new Date(peak.sampleSetStartDate).toLocaleString()}</td>
                        <td className="text-center">{new Date(peak.sampleSetFinishDate).toLocaleString()}</td>
                          <td className="text-center">{peak.noOfInjections}</td>
                          
                          <td className="text-center">{peak.sampleSetAcquiredBy }</td>
 
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
          <button
            className="page-link"
            onClick={() => !isFirstPage && handlePageChange(1)}
          >
            First
          </button>
        </li>
        <li className={`page-item ${isFirstPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => !isFirstPage && handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {pagesToShow.map(pageNumber => (
          <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={`page-item ${isLastPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
        <li className={`page-item ${isLastPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => !isLastPage && handlePageChange(totalPages)}
          >
            Last
          </button>
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

export default SampleSetDetails;
