import React, { useState,useContext, useEffect } from "react";
 
import { DndProvider, useDrag, useDrop } from "react-dnd";
 
import { HTML5Backend } from "react-dnd-html5-backend";
import UserContext from './UserContext';
 
import Select from "react-select";
const ItemType = "COLUMN";
 
const Column = ({ header, index, moveColumn }) => {
  const [, ref] = useDrag({
    type: ItemType,
 
    item: { index },
  });
 
  const [, drop] = useDrop({
    accept: ItemType,
 
    hover: (item) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
 
        item.index = index;
      }
    },
  });
 
  return (
    <tr ref={(node) => ref(drop(node))}>
      <td>{header}</td>
    </tr>
  );
};
 
const UsageLogSetting = () => {
  const [hplcData, setHplcData] = useState([]);
 
  const [columnData, setColumnData] = useState([]);
 
  const [hplcColumns, setHplcColumns] = useState([]);
 
  const [hplcOriginalColumns, setHplcOriginalColumns] = useState([]);
 
  const [hplcSelectedColumns, setHplcSelectedColumns] = useState([]);
  const { userData } = useContext(UserContext);
  const [hplcFilters, setHplcFilters] = useState([]);
 
  const [columnColumns, setColumnColumns] = useState([]);
 
  const [columnOriginalColumns, setColumnOriginalColumns] = useState([]);
 
  const [columnSelectedColumns, setColumnSelectedColumns] = useState([]);
 
  const [columnFilters, setColumnFilters] = useState([]);
 
  const [selectedData, setSelectedData] = useState("hplc"); // Default to HPLC Data
 
  useEffect(() => {
    const fetchHPLCData = async () => {
      try {
        const response = await fetch(
          "http://localhost:58747/api/PopulateHPLCUsage/GetPopulateHPLCUsageDetails"
        );
 
        const result = await response.json();
 
        setHplcData(result);
 
        if (result.length > 0) {
          const headers = Object.keys(result[0]);
 
          setHplcColumns(headers);
 
          setHplcOriginalColumns(headers);
 
          setHplcSelectedColumns(headers);
        }
      } catch (error) {
        console.error("Error fetching HPLC data:", error);
      }
    };
 
    const fetchColumnData = async () => {
      try {
        const response = await fetch(
          "http://localhost:58747/api/PopulateColumnUsage/GetPopulateColumnUsageDetails"
        );
 
        const result = await response.json();
 
        setColumnData(result);
 
        if (result.length > 0) {
          const headers = Object.keys(result[0]);
 
          setColumnColumns(headers);
 
          setColumnOriginalColumns(headers);
 
          setColumnSelectedColumns(headers);
        }
      } catch (error) {
        console.error("Error fetching Column data:", error);
      }
    };
 
    fetchHPLCData();
 
    fetchColumnData();
  }, []);
 
  const moveColumn = (fromIndex, toIndex) => {
    const updatedColumns = [
      ...(selectedData === "hplc" ? hplcColumns : columnColumns),
    ];
 
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
 
    updatedColumns.splice(toIndex, 0, movedColumn);
 
    if (selectedData === "hplc") {
      setHplcColumns(updatedColumns);
    } else {
      setColumnColumns(updatedColumns);
    }
  };
 
  // const saveOrder = () => {
  //   if (selectedData === "hplc") {
  //     setHplcOriginalColumns([...hplcColumns]);
  //   } else {
  //     setColumnOriginalColumns([...columnColumns]);
  //   }
 
  //   alert("Order saved successfully!");
  // };
 
  const saveOrder = async () => {
    await saveOrderToBackend();
    // You may also want to update local state or perform additional actions after saving
  };
 
 
  const saveOrderToBackend = async () => {
    const endpoint = selectedData === 'hplc'
      ? 'http://localhost:58747/api/PopulateHPLCUsage/SavechangeshplcDetails'
      : 'http://localhost:58747/api/PopulateColumnUsage/SavechangesColumnDetails';
    // console.log(endpoint)
    const columnsToSave = (selectedData === 'hplc' ? hplcColumns : columnColumns)
      .map((header, index) => ({
 
        nameOfTheColumn: header,
        orderOfTheColumn: index + 1,  // Ensure the order starts from 1
        isActive: currentSelectedColumns.includes(header) ? 1 : 0,  // Correctly set active status
        createdBy: userData?.employeeId || 'unknown',
        createdDate: new Date().toISOString()
      }));
      console.log(columnsToSave)
 
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(columnsToSave)
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error saving column order: ${errorText}`);
      }
 
      console.log("Data to be sent:", columnsToSave);
 
      const result = await response.json().catch(() => 'Data saved');
      alert('Order saved successfully!');
      return result;
    } catch (error) {
      console.error('Error saving column order:', error);
      alert('Failed to save order.');
    }
  };
 
 
const saveFilters = async () => {
    const endpoint = selectedData === 'hplc'
      ? 'http://localhost:58747/api/PopulateHPLCUsage/SelectfilterschangeshplcDetails'
      : 'http://localhost:58747/api/PopulateColumnUsage/SelectfilterschangesColumnDetails';
  
    // Prepare filters to save
    const filtersToSave = currentFilters.map(filter => ({
      filterName: filter.label,  // Ensure correct filterName value
      filterValue: 1,            // Filter is selected, so set value to 1
      createdBy: userData?.employeeId || 'unknown',
      createdDate: new Date().toISOString()
    }));

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtersToSave)  // Send correct data format
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error saving filters: ${errorText}`);
      }
  
      const responseText = await response.text();
      console.log('Response Text:', responseText);

      alert('Filters saved successfully!');
    } catch (error) {
      console.error('Error saving filters:', error);
      alert('Failed to save filters.');
    }
};


 
 
 
 
  const resetOrder = () => {
    if (selectedData === "hplc") {
      setHplcColumns([...hplcOriginalColumns]);
 
      setHplcSelectedColumns([...hplcOriginalColumns]);
 
      setHplcFilters([]); // Reset HPLC filters
    } else {
      setColumnColumns([...columnOriginalColumns]);
 
      setColumnSelectedColumns([...columnOriginalColumns]);
 
      setColumnFilters([]); // Reset Column filters
    }
  };
 
  const handleColumnSelection = (header) => {
    if (selectedData === "hplc") {
      if (hplcSelectedColumns.includes(header)) {
        setHplcSelectedColumns(
          hplcSelectedColumns.filter((col) => col !== header)
        );
      } else {
        setHplcSelectedColumns([...hplcSelectedColumns, header]);
      }
    } else {
      if (columnSelectedColumns.includes(header)) {
        setColumnSelectedColumns(
          columnSelectedColumns.filter((col) => col !== header)
        );
      } else {
        setColumnSelectedColumns([...columnSelectedColumns, header]);
      }
    }
  };
 
  const handleDataSelection = (event) => {
    const dataType = event.target.value;
 
    setSelectedData(dataType);
  };
 
  const handleFilterChange = (selectedOptions) => {
    if (selectedData === "hplc") {
      setHplcFilters(selectedOptions || []);
    } else {
      setColumnFilters(selectedOptions || []);
    }
  };
 
  const currentColumns = selectedData === "hplc" ? hplcColumns : columnColumns;
 
  const currentOriginalColumns =
    selectedData === "hplc" ? hplcOriginalColumns : columnOriginalColumns;
 
  const currentSelectedColumns =
    selectedData === "hplc" ? hplcSelectedColumns : columnSelectedColumns;
 
  const currentFilters = selectedData === "hplc" ? hplcFilters : columnFilters;
 
  return (
    <>
      <style>{`
 
        .tables-container {
 
          display: flex;
 
          justify-content: space-between; /* Ensures equal spacing between tables */
 
        }
 
        .table-container {
 
          width: 48%; /* Adjust width to ensure equal size and space between tables */
 
        }
 
        table {
 
          width: 100%; /* Make sure each table takes full width of its container */
 
          border-collapse: collapse;
 
        }
 
        th, td {
 
          padding: 8px;
 
          text-align: left;
 
          border: 1px solid #ddd;
 
        }
 
      `}</style>
 
      <section className="full_screen">
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb cooseText mb-2">
              <li className="breadcrumb-item active" aria-current="page">
                Usage log settings
              </li>
            </ol>
          </nav>
 
          {/* Dropdown for selecting data */}
 
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="dataSelection"
              style={{ fontSize: "18px", marginRight: "10px" }}
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
 
          <div className="tables-container">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Select the columns</th>
                  </tr>
                </thead>
 
                <tbody>
                  {currentOriginalColumns.map((header, index) => (
                    <tr key={index}>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            checked={currentSelectedColumns.includes(header)}
                            onChange={() => handleColumnSelection(header)}
                          />
 
                          {header}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            <div className="table-container">
              <DndProvider backend={HTML5Backend}>
                <table>
                  <thead>
                    <tr>
                      <th>Order of the columns</th>
                    </tr>
                  </thead>
 
                  <tbody>
                    {currentColumns
                      .filter((header) =>
                        currentSelectedColumns.includes(header)
                      )
                      .map((header, index) => (
                        <Column
                          key={header}
                          index={index}
                          header={header}
                          moveColumn={moveColumn}
                        />
                      ))}
                  </tbody>
                </table>
              </DndProvider>
            </div>
          </div>
 
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <label style={{ fontSize: "18px", marginRight: "10px" }}>Select Filters:</label>
            <Select
              isMulti
              options={currentOriginalColumns.map(col => ({ value: col, label: col }))}
              onChange={handleFilterChange}
              value={currentFilters}
              styles={{
                container: base => ({ ...base, width: 300 }),
                menu: provided => ({ ...provided, zIndex: 9999 }),
              }}
            />
          </div>
         
          <button className="btn btn-primary" onClick={saveOrder} style={{ marginRight: '10px' }}>Save Order</button>
          <button className="btn btn-primary" onClick={saveFilters} style={{ marginRight: '10px' }}>Save Filters</button>
          <button className="btn btn-secondary" onClick={resetOrder}>Reset</button>
        </div>
      </section>
    </>
  );
};
 
export default UsageLogSetting;
 
 