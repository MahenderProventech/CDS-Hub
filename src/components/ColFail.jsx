import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import http from './Http';

const ColFail = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [columnNo, setColumnNo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [xAxisLabel, setXAxisLabel] = useState('Injection Count'); // Default x-axis label
    const [yAxisLabel, setYAxisLabel] = useState('USP Plate Count'); // Default y-axis label
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const generateXAxisLabels = (count) => {
        return Array.from({ length: Math.ceil(count / 5) }, (_, i) => (i + 1) * 5);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
      const response = await http.get("Peaks/GetPeaksDetails"); 
                // const response = await axios.get("http://localhost:58747/api/Peaks/GetPeaksDetails");
                const processedData = processData(response.data);
                setData(processedData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const processData = (rawData) => {
        if (!rawData || !Array.isArray(rawData.item2)) {
            console.error("Invalid data format:", rawData);
            return [];
        }

        const updatedData = rawData.item2.map(item => ({
            ...item,
            SampleSetStartDate: new Date(item.sampleSetStartDate),
            USPPlateCount: Number(item.uspPlateCount),
            RetentionTime: Number(item.retentionTime), // Include Retention Time
        })).filter(item => item.sampleSetId && item.injectionId && item.uspPlateCount && item.retentionTime);

        updatedData.sort((a, b) => a.sampleSetId - b.sampleSetId);

        const aggregatedData = [];
        updatedData.forEach(item => {
            const existing = aggregatedData.find(i => i.sampleSetId === item.sampleSetId && i.injectionId === item.injectionId);
            if (existing) {
                existing.InjectionCount++;
            } else {
                aggregatedData.push({
                    ...item,
                    InjectionCount: 1,
                });
            }
        });

        aggregatedData.forEach((item, index) => {
            item.USPPlateCountDiff = index > 0 ? item.uspPlateCount - aggregatedData[index - 1].uspPlateCount : 0;
            item.PercentageDifference = item.USPPlateCountDiff / (index > 0 ? aggregatedData[index - 1].uspPlateCount : 1) * 100;
            item.IsFailure = item.uspPlateCount < 4000 ? 1 : 0;
        });

        return aggregatedData;
    };

    const handleColumnChange = (event) => {
        const selectedColumn = event.target.value;
        setColumnNo(selectedColumn);
        const filtered = data.filter(item => item.column_No === selectedColumn);
        setFilteredData(filtered);
    };

    const handleYAxisLabelChange = (event) => {
        setYAxisLabel(event.target.value);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const pagesToShow = [];
    if (totalPages > 1) {
      if (!isFirstPage) pagesToShow.push(currentPage - 1);
      pagesToShow.push(currentPage);
      if (!isLastPage) pagesToShow.push(currentPage + 1);
    }

    const pageData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    if (loading) return <div className="page-loader"><p>{loading && (<div className="page-loader"><div className="loading-dots"><div className="loading-dots--dot"></div><div className="loading-dots--dot"></div><div className="loading-dots--dot"></div></div></div>)}</p></div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1>Column Health Tracker</h1>
            <div className="form-group">
                <label>Select Column Number:</label>
                <select className="form-control" value={columnNo} onChange={handleColumnChange}>
                    <option value="">Select a column</option>
                    {[...new Set(data.map(item => item.column_No))].map(column => (
                        <option key={column} value={column}>{column}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
    <label>Select Y-Axis Label:</label>
    <select className="form-control" value={yAxisLabel} onChange={handleYAxisLabelChange}>
        <option value="USP Plate Count">USP Plate Count</option>
        <option value="USP Tailing">USP Tailing</option>
        <option value="Retention Time">Retention Time</option>
    </select>
</div>

            <h2>{yAxisLabel} Over {xAxisLabel}</h2>
            <Line
    data={{
        labels: generateXAxisLabels(filteredData.length),
        datasets: [
            {
                label: yAxisLabel,
                data: filteredData.map(item => {
                    switch (yAxisLabel) {
                        case 'USP Plate Count':
                            return item.uspPlateCount;
                        case 'USP Tailing':
                            return item.uspTailing;
                        case 'Retention Time':
                            return item.retentionTime;
                        default:
                            return 0;
                    }
                }),
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                fill: false,
            },
            ...(yAxisLabel === 'USP Plate Count' ? [
                {
                    label: 'Failure Threshold',
                    data: new Array(filteredData.length).fill(4000),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderDash: [5, 5],
                    fill: false,
                },
            ] : []),
            ...(yAxisLabel === 'USP Tailing' ? [
                {
                    label: 'Lower Limit (0.8)',
                    data: new Array(filteredData.length).fill(0.8),
                    borderColor: 'rgba(255, 165, 0, 1)',
                    borderDash: [5, 5],
                    fill: false,
                },
                {
                    label: 'Upper Limit (1.2)',
                    data: new Array(filteredData.length).fill(1.2),
                    borderColor: '#c67632',
                    borderDash: [5, 5],
                    fill: false,
                },
            ] : []),
            ...(yAxisLabel === 'Retention Time' ? [
                {
                    label: 'Lower Limit (1.5)', // Set the appropriate lower limit
                    data: new Array(filteredData.length).fill(1.5),
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderDash: [5, 5],
                    fill: false,
                },
                {
                    label: 'Upper Limit (3.0)', // Set the appropriate upper limit
                    data: new Array(filteredData.length).fill(3.0),
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderDash: [5, 5],
                    fill: false,
                },
            ] : []),
        ],
    }}
    options={{
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisLabel,
                },
            },
            y: {
                min: 0, // Start from 0 on the y-axis
                title: {
                    display: true,
                    text: yAxisLabel,
                },
            },
        },
    }}
/>
{/* <p>
    <b>Total Injections Before Failure: </b>
    {filteredData.reduce((acc, item) => {
        if (item.IsFailure === 1) {
            return acc; // Stop counting after a failure
        }
        return acc + item.InjectionCount;
    }, 0)}
</p> */}

<p>
    <b>Total Injections Before First Failure: </b>
    {filteredData.reduce((acc, item) => {
        if (acc.stopCounting) return acc; // Stop counting once a failure is encountered
        if (item.IsFailure === 1) {
            acc.stopCounting = true; // Mark that a failure has occurred
        } else {
            acc.total += item.InjectionCount; // Add to the total if no failure yet
        }
        return acc;
    }, { total: 0, stopCounting: false }).total}
</p>

<div className="row">
                <div className="col-sm-2">
                    <div className="mb-2">
                        <label htmlFor="rowsPerPage" className="form-label"><b>Rows Per Page</b></label>
                        <select
                            className="form-select"
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredData.length > 0 ? (
                <>
                    <h2>Filtered Data</h2>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Column No</th>
                                <th>SampleSetId</th>
                                <th>InjectionId</th>
                                <th>USPPlateCount</th>
                                <th>InjectionDate</th>
                                <th>InjectionCount</th>
                                <th>USPPlateCountDiff</th>
                                <th>PercentageDifference</th>
                                <th>USP Tailing</th>
                                <th>IsFailure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {filteredData.map((item, index) => ( */}
                            {pageData.map((item, index) => (

                                <tr key={index}>
                                    <td>{item.column_No}</td>
                                    <td>{item.sampleSetId}</td>
                                    <td>{item.injectionId}</td>
                                    <td>{item.uspPlateCount}</td>
                                    <td>{item.SampleSetStartDate.toLocaleString()}</td>
                                    <td>{item.InjectionCount}</td>
                                    <td>{item.USPPlateCountDiff}</td>
                                    <td>{item.PercentageDifference}</td>
                                    <td>{item.uspTailing}</td>
                                    <td>{item.IsFailure === 1 ? "Fail" : "Pass"}</td>
                                    </tr>
                            ))}
                        </tbody>
                    </Table>
                   
                </>
            ) : (
                <p>No data available for the selected column.</p>
            )}
            <div className="pagination">
                <button disabled={isFirstPage} onClick={() => handlePageChange(1)}>
                    First
                </button>
                <button disabled={isFirstPage} onClick={() => handlePageChange(currentPage - 1)}>
                    Previous
                </button>
                {pagesToShow.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "active" : ""}
                    >
                        {page}
                    </button>
                ))}
                <button disabled={isLastPage} onClick={() => handlePageChange(currentPage + 1)}>
                    Next
                </button>
                <button disabled={isLastPage} onClick={() => handlePageChange(totalPages)}>
                    Last
                </button>
            </div>
        </div>
        // </div>
    );
};

export default ColFail;
