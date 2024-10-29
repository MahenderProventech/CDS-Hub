import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ColFail = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [columnNo, setColumnNo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [xAxisLabel, setXAxisLabel] = useState('Injection Count'); // Default x-axis label
    const [yAxisLabel, setYAxisLabel] = useState('USP Plate Count'); // Default y-axis label

    const generateXAxisLabels = (count) => {
        return Array.from({ length: Math.ceil(count / 5) }, (_, i) => (i + 1) * 5);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:58747/api/Peaks/GetPeaksDetails");
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
        })).filter(item => item.sampleSetId && item.injectionId && item.uspPlateCount);

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
                    return yAxisLabel === 'USP Plate Count' ? item.uspPlateCount :
                           item.uspTailing; // Adjust data based on selected y-axis label
                }),
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                fill: false,
            },
            // Only show the failure threshold for USP Plate Count
            ...(yAxisLabel === 'USP Plate Count' ? [
                {
                    label: 'Failure Threshold',
                    data: new Array(filteredData.length).fill(4000), // Only show threshold for USP Plate Count
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderDash: [5, 5],
                    fill: false,
                },
            ] : []),
            // Add threshold lines for USP Tailing
            ...(yAxisLabel === 'USP Tailing' ? [
                {
                    label: 'Lower Limit (0.8)',
                    data: new Array(filteredData.length).fill(0.8),
                    borderColor: 'rgba(255, 165, 0, 1)', // Orange color
                    borderDash: [5, 5],
                    fill: false,
                },
                {
                    label: 'Upper Limit (1.2)',
                    data: new Array(filteredData.length).fill(1.2),
                    borderColor: '#c67632', // Green color
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
                            {filteredData.map((item, index) => (
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
                                    <td>{item.IsFailure}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            ) : (
                <p>No data available for the selected column.</p>
            )}
        </div>
    );
};

export default ColFail;
