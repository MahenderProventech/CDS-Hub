import React, { useState, useContext, useEffect } from "react";
import UserContext from "./UserContext";
import http from "./Http";

const NameConfig = () => {
  const [hplcData, setHplcData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [hplcColumns, setHplcColumns] = useState([]);
  const [columnColumns, setColumnColumns] = useState([]);
  const [selectedData, setSelectedData] = useState("hplc"); // Default to HPLC Data
  const [dynamicColumnNames, setDynamicColumnNames] = useState({}); // State to store dynamic names
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchHPLCData = async () => {
      try {
        const response = await http.get(
          "PopulateHPLCUsage/GetPopulateHPLCUsageDetails"
        );
        const result = response.data;

        setHplcData(result);
        if (result.length > 0) {
          setHplcColumns(Object.keys(result[0]));
        }
      } catch (error) {
        console.error("Error fetching HPLC data:", error);
      }
    };

    const fetchColumnData = async () => {
      try {
        const response = await http.get(
          "PopulateColumnUsage/GetPopulateColumnUsageDetails"
        );
        const result = response.data;

        setColumnData(result);
        if (result.length > 0) {
          setColumnColumns(Object.keys(result[0]));
        }
      } catch (error) {
        console.error("Error fetching Column data:", error);
      }
    };

    fetchHPLCData();
    fetchColumnData();
  }, []);

  const handleDataSelection = (event) => {
    setSelectedData(event.target.value);
  };

  const handleDynamicNameChange = (columnName, newName) => {
    setDynamicColumnNames((prevNames) => ({
      ...prevNames,
      [columnName]: newName,
    }));
  };

  const handleSaveHPLC = async () => {
    try {
      // Check if employeeId exists in userData
      const employeeId = userData?.employeeId;
      if (!employeeId) {
        alert("Employee ID is missing. Please log in again.");
        return;
      }
  
      // Select only the first row of hplcData (or any other specific row)
      const dataToSend = [hplcData[0]]; // Only the first row, or change the index as needed
  
      const payload = dataToSend.map((row, index) => {
        const rowData = {
          s_No: index + 1, // Incremental serial number
          id: dynamicColumnNames["id"] || "id", // Default to "id" if not provided
          sampleSetId: dynamicColumnNames["sampleSetId"] || "sampleSetId", // Default to "sampleSetId"
          dateAcquired: dynamicColumnNames["dateAcquired"] || "dateAcquired", // Default to "dateAcquired"
          instrument_No: dynamicColumnNames["instrument_No"] || "instrument_No", // Default to "instrument_No"
          product_Name: dynamicColumnNames["product_Name"] || "product_Name", // Default to "product_Name"
          a_R_No: dynamicColumnNames["a_R_No"] || "a_R_No", // Default to "a_R_No"
          batch_No: dynamicColumnNames["batch_No"] || "batch_No", // Default to "batch_No"
          test_Name: dynamicColumnNames["test_Name"] || "test_Name", // Default to "test_Name"
          sampleSetStartDate: dynamicColumnNames["sampleSetStartDate"] || "sampleSetStartDate", // Default to "sampleSetStartDate"
          sampleSetFinishDate: dynamicColumnNames["sampleSetFinishDate"] || "sampleSetFinishDate", // Default to "sampleSetFinishDate"
          noOfInjections: dynamicColumnNames["noOfInjections"] || "noOfInjections", // Default to "noOfInjections"
          runtime: dynamicColumnNames["runtime"] || "runtime", // Default to "runtime"
          sampleSetAcquiredBy: dynamicColumnNames["sampleSetAcquiredBy"] || "sampleSetAcquiredBy", // Default to "sampleSetAcquiredBy"
          employeeId, // Add employeeId to the payload
          createdOn: new Date().toISOString(), // Capture current timestamp
        };
  
        // Log each row payload for debugging
        // console.log(`Row ${index + 1} Payload:`, rowData);
        return rowData;
      });
  
      // Log the full payload to verify all data before sending
      console.log("HPLC Payload:", payload);
  
      // Make the API request to save the data
      const response = await http.post(
        "PopulateHPLCUsage/SaveDynamicHplcNames",
        payload
      );
  
      // Log and alert on successful save
      // console.log("HPLC Save Response:", response.data);
      alert("HPLC column names saved successfully!");
  
    } catch (error) {
      // Enhanced error handling with proper logging
      console.error("Error saving HPLC column names:", error.response || error);
      alert("Failed to save HPLC column names.");
    }
  };



  const handleSaveColumn = async () => {
  try {
    // Check if employeeId exists in userData
    const employeeId = userData?.employeeId;
    if (!employeeId) {
      alert("Employee ID is missing. Please log in again.");
      return;
    }

    // Select only the first row of hplcData (or any other specific row)
    const dataToSend = [hplcData[0]]; // Only the first row, or change the index as needed

    const payload = dataToSend.map((row, index) => {
      const rowData = {
        s_No: index + 1, // Incremental serial number
        id: dynamicColumnNames["id"] || "id", // Default to "id" if not provided
        sampleSetId: dynamicColumnNames["sampleSetId"] || "sampleSetId", // Default to "sampleSetId"
        dateAcquired: dynamicColumnNames["dateAcquired"] || "dateAcquired", // Default to "dateAcquired"
        instrument_No: dynamicColumnNames["instrument_No"] || "instrument_No", // Default to "instrument_No"
        product_Name: dynamicColumnNames["product_Name"] || "product_Name", // Default to "product_Name"
        a_R_No: dynamicColumnNames["a_R_No"] || "a_R_No", // Default to "a_R_No"
        batch_No: dynamicColumnNames["batch_No"] || "batch_No", // Default to "batch_No"
        test_Name: dynamicColumnNames["test_Name"] || "test_Name", // Default to "test_Name"
        sampleSetStartDate: dynamicColumnNames["sampleSetStartDate"] || "sampleSetStartDate", // Default to "sampleSetStartDate"
        sampleSetFinishDate: dynamicColumnNames["sampleSetFinishDate"] || "sampleSetFinishDate", // Default to "sampleSetFinishDate"
        noOfInjections: dynamicColumnNames["noOfInjections"] || "noOfInjections", // Default to "noOfInjections"
        runtime: dynamicColumnNames["runtime"] || "runtime", // Default to "runtime"
        sampleSetAcquiredBy: dynamicColumnNames["sampleSetAcquiredBy"] || "sampleSetAcquiredBy", // Default to "sampleSetAcquiredBy"
        column_No: dynamicColumnNames["column_No"] || "column_No", // Default to "runtime"
        employeeId, // Add employeeId to the payload
        createdOn: new Date().toISOString(), // Capture current timestamp
      };

      // Log each row payload for debugging
      // console.log(`Row ${index + 1} Payload:`, rowData);
      return rowData;
    });

    // Log the full payload to verify all data before sending
    console.log("Column Payload:", payload);

    // Make the API request to save the data
    const response = await http.post(
      "PopulateColumnUsage/SaveDynamicColumnNames",
      payload
    );

    // Log and alert on successful save
    // console.log("HPLC Save Response:", response.data);
    alert("Column names saved successfully!");

  } catch (error) {
    // Enhanced error handling with proper logging
    console.error("Error saving Column names:", error.response || error);
    alert("Failed to save Column names.");
  }
};
  // const handleSaveColumn = async () => {
  //   try {
  //     const payload = {
  //       columnNames: dynamicColumnNames,
  //       createdBy: userData?.employeeId,
  //     };
  //     console.log("Column Payload:", payload);
  
  //     const response = await http.post(
  //       "PopulateColumnUsage/SaveDynamicColumnNames",
  //       payload
  //     );
  //     console.log("Column Save Response:", response.data);
  
  //     alert("Column data column names saved successfully!");
  //   } catch (error) {
  //     console.error("Error saving Column column names:", error.response || error);
  //     alert("Failed to save Column column names.");
  //   }
  // };
  
  

    const resetOrder = () => {
      // Reset the dynamic column names for the current dataset
      const currentColumnKeys =
        selectedData === "hplc" ? hplcColumns : columnColumns;
  
      const resetNames = currentColumnKeys.reduce((acc, col) => {
        acc[col] = ""; // Reset the name to an empty string
        return acc;
      }, {});
  
      setDynamicColumnNames((prevNames) => ({
        ...prevNames,
        ...resetNames,
      }));
    };


  const currentColumns = selectedData === "hplc" ? hplcColumns : columnColumns;

  return (
    <section className="full_screen">
      <div className="container-fluid">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb cooseText mb-2">
            <li className="breadcrumb-item active" aria-current="page">
              Dynamic Column Name Configuration
            </li>
          </ol>
        </nav>

        {/* Dropdown for selecting data */}
        <div
          className="card mt-3"
          style={{ padding: "1.5rem", width: "98%", marginLeft: "5px" }}
        >
          <div style={{ marginBottom: "20px", marginTop: "20px" }}>
            <label
              htmlFor="dataSelection"
              style={{ fontSize: "20px", marginRight: "10px" }}
            >
              Select Data:{" "}
            </label>

            <select
              id="dataSelection"
              value={selectedData}
              onChange={handleDataSelection}
              style={{
                width: "200px", // Increase the width of the dropdown
                fontSize: "16px", // Adjust font size if needed
                padding: "8px", // Adjust padding for a larger dropdown
              }}
            >
              <option value="hplc">HPLC Data</option>
              <option value="column">Column Data</option>
            </select>
          </div>
        </div>

        {/* Display Columns with Dynamic Name Input */}
        <table
          border="1"
          style={{
            width: "95%",
            marginTop: "20px",
            marginLeft: "10px",
          }}
        >
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Custom Name</th>
            </tr>
          </thead>
          <tbody>
            {currentColumns.map((col) => (
              <tr key={col}>
                <td>{col}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter custom name"
                    value={dynamicColumnNames[col] || ""}
                    onChange={(e) =>
                      handleDynamicNameChange(col, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Save Button */}
        {/* <div style={{ marginTop: "20px", marginLeft: "10px" }}> */}
        <div className="mb-5 mt-5">
  {selectedData === "hplc" && (
    <button
      onClick={handleSaveHPLC}
      className="btn btn-primary"
      style={{ marginRight: "10px", marginLeft: "10px", fontSize: "13px" }}
    >
      Save HPLC
    </button>
  )}

  {selectedData === "column" && (
    <button
      onClick={handleSaveColumn}
      className="btn btn-primary"
      style={{ marginRight: "10px", marginLeft: "10px", fontSize: "13px" }}
    >
      Save Column
    </button>
  )}

  <button
    className="btn btn-secondary"
    onClick={resetOrder}
    style={{ fontSize: "13px" }}
  >
    Reset
  </button>
</div>

      </div>
    </section>
  );
};

export default NameConfig;