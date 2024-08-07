import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SampleSetDetails = () => {
  const { sampleSetId } = useParams();
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instrumentId, setInstrumentId] = useState("");
  const [peaksData, setPeaksData] = useState([]);
  const [instruments, setInstruments] = useState([]);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:58747/api/Peaks/GetPeaksDetails"
        );
        const data = await response.json();
        console.log("Fetched data:", data);
 
        if (Array.isArray(data.item2)) {
          setPeaksData(data.item2);
          setFilteredData(data.item2);
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
      finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };
 
    fetchData();
  }, []);

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

  return (
    <div>
      <h1>Details for Sample Set ID: {sampleSetId}</h1>
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
                        <th className="text-center">AR Number</th>
                        <th className="text-center">Batch no.</th>
                        <th className="text-center">Test Name</th>
                        <th className="text-center">Injection Id</th>
                        <th className="text-center">Sample Set Start Date</th>
                        <th className="text-center">Sample Set Finish Date</th>
                        <th className="text-center">No.of Injections</th>
                        <th className="text-center">Runtime</th>
                        <th className="text-center">Acquired By</th>

                      </tr>
                    </thead>
                    <tbody>
                    {currentData.map((peak, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>     
                          <td className="text-center">
                            {peak.dateAcquired}
                          </td>
                          <td className="text-center">{peak.instrument_No}</td>
                          <td className="text-center">{peak.product_Name}</td>
                          <td className="text-center">  <a href={`/home/HPLCLog_List/${peak.sampleSetId}`} className="link-primary">{peak.sampleSetId} </a></td>
                          <td className="text-center">{peak.a_R_No}</td>
                          <td className="text-center">{peak.batch_No}</td>
                          <td className="text-center">{peak.test_Name}</td>
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
                          <td className="text-center">{peak.sampleSetAcquiredBy}</td>

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
  );
};

export default SampleSetDetails;
