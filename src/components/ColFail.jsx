import React, { useState, useEffect } from 'react';
import http from './Http';
import { Line } from 'react-chartjs-2';

const ColFail = () => {
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const failureThreshold = 4000;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await http.get("Peaks/GetPeaksDetails");
      const fetchedData = response.data.item2 || [];
      processFilteredData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processFilteredData = (data) => {
    const processedData = data.map((item, index, array) => {
      // Convert to numeric and apply failure threshold
      const uspPlateCount = parseFloat(item.uspPlateCount) || 0;
      const isFailure = uspPlateCount < failureThreshold ? 1 : 0;
      const prevUSP = array[index - 1] ? parseFloat(array[index - 1].uspPlateCount) : 0;

      // Calculate differences and rolling mean
      const uspPlateCountDiff = uspPlateCount - prevUSP;
      const percentageDifference = prevUSP ? (uspPlateCountDiff / prevUSP) * 100 : 0;
      
      return {
        ...item,
        uspPlateCount,
        isFailure,
        uspPlateCountDiff,
        percentageDifference,
      };
    });

    // Grouped result for rolling mean (basic)
    const rollingMeanData = processedData.map((item, idx, arr) => {
      const startIdx = Math.max(0, idx - 4);
      const meanArray = arr.slice(startIdx, idx + 1).map((d) => d.uspPlateCount);
      const rollingMeanUSP = meanArray.reduce((sum, val) => sum + val, 0) / meanArray.length;
      return {
        ...item,
        rollingMeanUSP,
      };
    });

    setResult(rollingMeanData);
    createChartData(rollingMeanData);
  };

  const createChartData = (data) => {
    const labels = data.map((_, index) => index + 1);
    const uspPlateCounts = data.map(item => item.uspPlateCount);
    const rollingMeans = data.map(item => item.rollingMeanUSP);
    const failures = data.map(() => failureThreshold);

    return {
      labels,
      datasets: [
        {
          label: "USP Plate Count",
          data: uspPlateCounts,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
        {
          label: "Failure Threshold (4000)",
          data: failures,
          borderColor: "rgba(255, 99, 132, 1)",
          borderDash: [5, 5],
          fill: false,
        },
        {
          label: "Rolling Mean",
          data: rollingMeans,
          borderColor: "rgba(153, 102, 255, 1)",
          fill: false,
        },
      ],
    };
  };

  const chartData = createChartData(result);

  return (
    <section className="full_screen" style={{ height: "100vh" }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ marginLeft: "10px", marginRight: "20px" }}>
          <h1>Sample Set Injection Summary</h1>
          <Line data={chartData} options={{
            scales: {
              x: { title: { display: true, text: 'Injection Number' } },
              y: { title: { display: true, text: 'USP Plate Count' } },
            },
          }} />
        </div>
      )}
    </section>
  );
};

export default ColFail;
