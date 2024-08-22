import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Select from 'react-select';

const ItemType = 'COLUMN';

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
  const [hplcFilters, setHplcFilters] = useState([]);

  const [columnColumns, setColumnColumns] = useState([]);
  const [columnOriginalColumns, setColumnOriginalColumns] = useState([]);
  const [columnSelectedColumns, setColumnSelectedColumns] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const [selectedData, setSelectedData] = useState('hplc'); // Default to HPLC Data

  useEffect(() => {
    const fetchHPLCData = async () => {
      try {
        const response = await fetch('http://localhost:58747/api/PopulateHPLCUsage/GetPopulateHPLCUsageDetails');
        const result = await response.json();
        setHplcData(result);

        if (result.length > 0) {
          const headers = Object.keys(result[0]);
          setHplcColumns(headers);
          setHplcOriginalColumns(headers);
          setHplcSelectedColumns(headers);
        }
      } catch (error) {
        console.error('Error fetching HPLC data:', error);
      }
    };

    const fetchColumnData = async () => {
      try {
        const response = await fetch('http://localhost:58747/api/PopulateColumnUsage/GetPopulateColumnUsageDetails');
        const result = await response.json();
        setColumnData(result);

        if (result.length > 0) {
          const headers = Object.keys(result[0]);
          setColumnColumns(headers);
          setColumnOriginalColumns(headers);
          setColumnSelectedColumns(headers);
        }
      } catch (error) {
        console.error('Error fetching Column data:', error);
      }
    };

    fetchHPLCData();
    fetchColumnData();
  }, []);

  const moveColumn = (fromIndex, toIndex) => {
    const updatedColumns = [...(selectedData === 'hplc' ? hplcColumns : columnColumns)];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);

    if (selectedData === 'hplc') {
      setHplcColumns(updatedColumns);
    } else {
      setColumnColumns(updatedColumns);
    }
  };

  const saveOrder = () => {
    if (selectedData === 'hplc') {
      setHplcOriginalColumns([...hplcColumns]);
    } else {
      setColumnOriginalColumns([...columnColumns]);
    }
    alert('Order saved successfully!');
  };

  const resetOrder = () => {
    if (selectedData === 'hplc') {
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
    if (selectedData === 'hplc') {
      if (hplcSelectedColumns.includes(header)) {
        setHplcSelectedColumns(hplcSelectedColumns.filter(col => col !== header));
      } else {
        setHplcSelectedColumns([...hplcSelectedColumns, header]);
      }
    } else {
      if (columnSelectedColumns.includes(header)) {
        setColumnSelectedColumns(columnSelectedColumns.filter(col => col !== header));
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
    if (selectedData === 'hplc') {
      setHplcFilters(selectedOptions || []);
    } else {
      setColumnFilters(selectedOptions || []);
    }
  };

  const currentColumns = selectedData === 'hplc' ? hplcColumns : columnColumns;
  const currentOriginalColumns = selectedData === 'hplc' ? hplcOriginalColumns : columnOriginalColumns;
  const currentSelectedColumns = selectedData === 'hplc' ? hplcSelectedColumns : columnSelectedColumns;
  const currentFilters = selectedData === 'hplc' ? hplcFilters : columnFilters;

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
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="dataSelection" style={{ fontSize: '18px', marginRight: '10px' }}>Select Data: </label>
            <select
              id="dataSelection"
              value={selectedData}
              onChange={handleDataSelection}
              style={{
                width: '200px', // Increase the width of the dropdown
                fontSize: '16px', // Adjust font size if needed
                padding: '8px', // Adjust padding for a larger dropdown
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
                    {currentColumns.filter(header => currentSelectedColumns.includes(header)).map((header, index) => (
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

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="filterSelection" style={{ fontSize: '18px', marginRight: '10px' }}>Select Filters: </label>
            <Select
              id="filterSelection"
              value={currentFilters}
              onChange={handleFilterChange}
              options={currentColumns.filter(header => currentSelectedColumns.includes(header)).map(col => ({ label: col, value: col }))}
              isMulti
              styles={{ container: (provided) => ({ ...provided, width: '400px' }) }}
            />
          </div>

          <div
            className="d-flex justify-content-end align-items-center my-3"
            style={{ marginLeft: "10px" }}
          >
            <button className="btn btn-primary me-2" onClick={saveOrder}>
              Save order
            </button>
            <button className="btn btn-outline-dark" onClick={resetOrder}>
              Reset order
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default UsageLogSetting;
