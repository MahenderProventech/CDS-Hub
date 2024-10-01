import React, { useState, useContext, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import UserContext from "./UserContext";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import http from "./Http";
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
        const response = await http.get("PopulateHPLCUsage/GetPopulateHPLCUsageDetails"
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
        const response = await http.get("PopulateColumnUsage/GetPopulateColumnUsageDetails"
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

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

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

  const saveOrder = async () => {
    await saveOrderToBackend();
  };

  const saveOrderToBackend = async () => {
    const endpoint =
      selectedData === "hplc"
        ? "/PopulateHPLCUsage/SavechangeshplcDetails"
        : "/PopulateColumnUsage/SavechangesColumnDetails";

    const columnsToSave = (
      selectedData === "hplc" ? hplcColumns : columnColumns
    ).map((header, index) => ({
      nameOfTheColumn: header,
      orderOfTheColumn: index + 1,
      isActive: currentSelectedColumns.includes(header) ? 1 : 0,
      createdBy: userData?.employeeId || "unknown",
      createdDate: new Date().toISOString(),
    }));
    console.log("DATA STORED PATTERN:",columnsToSave);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(columnsToSave),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error saving column order: ${errorText}`);
      }

      handleShowModal("Order saved successfully!");
    } catch (error) {
      console.error("Error saving column order:", error);
      handleShowModal("Failed to save order.");
    }
  };

  const saveFilters = async () => {
    const endpoint =
      selectedData === "hplc"
        ? "/PopulateHPLCUsage/SelectfilterschangeshplcDetails"
        : "/PopulateColumnUsage/SelectfilterschangescolumnDetails";

    // Define all possible filters
    const allFilters = [
      { label: 'sampleSetId' },
      { label: 'instrument_No' },
      { label: 'product_Name' },
      { label: 'test_Name' },
      { label: 'id' },
      { label: 'sampleSetAcquiredBy' },
      { label: 'a_R_No' },
      { label: 'batch_No' },
      { label: 'sampleSetStartDate' },
      { label: 'sampleSetFinishDate' },
      { label: 'noOfInjections' },
      { label: 'runtime' },
      { label: 'dateAcquired' },
      { label: 'column_No' }
      // Add all other possible filters here
    ];

    // Determine active filters based on currentFilters
    const activeFilters = currentFilters.map(filter => filter.label);

    // Create the list of filters to be saved
    const filtersToSave = allFilters.map((filter, index) => ({
      filterName: filter.label,
      orderOfTheColumn: index + 1, // Assigning order based on index or other logic
      filterValue: activeFilters.includes(filter.label) ? 1 : 0, // 1 if active, 0 otherwise
      createdBy: userData?.employeeId || "unknown", // User ID or default value
      createdDate: new Date().toISOString(), // Current date and time
    }));

    console.log("filters stored:", filtersToSave);

    try {
      // Send the data to the backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filtersToSave),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error saving filters: ${errorText}`);
      }

      handleShowModal("Filters saved successfully!");
    } catch (error) {
      console.error("Error saving filters:", error);
      handleShowModal("Failed to save filters.");
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

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClickWithDelay = async (callback) => {
    setIsButtonDisabled(true); // Disable the button

    await callback(); // Execute the callback function (saveOrder or saveFilters)

    setTimeout(() => {
      setIsButtonDisabled(false); // Re-enable the button after 1 second
    }, 1000); // 1000 milliseconds = 1 second
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
.usage-log-setting {
    padding: 20px;
}

.usage-log-setting h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

.table-container {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table-container th,
.table-container td {
    padding: 12px;
    border: 5px solid #ddd;
    text-align: left;
    font-size: 14px;
}

.table-container th {
    background-color: #f4f4f4;
    color: #333;
}

.table-container tr:nth-child(even) {
    background-color: #f9f9f9;
}

.table-container tr:hover {
    background-color: #f1f1f1;
    cursor: move;
}

.table-container input[type="checkbox"] {
    width: 15px;
    height: 15px;
    transform: scale(1.2);
    margin-right: 10px;
}

.table-container tr {
    transition: background-color 0.2s ease-in-out;
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
          <div
                  className="card mt-3"
                  style={{ padding: "1.5rem", width: "98%", marginLeft: "5px" }}
                >
          <div style={{ marginBottom: "20px",marginTop:"20px" }}>
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

          <div style={{ marginTop: "20px", marginBottom: "30px" }}>
            <label style={{ fontSize: "17px", marginRight: "10px" }}>
              Select Filters
            </label>
            <Select
              options={currentSelectedColumns.map((col) => ({
                value: col,
                label: col,
              }))}
              isMulti
              value={currentFilters}
              onChange={handleFilterChange}
              styles={{
                container: (base) => ({ ...base, width: 900 }),
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
              }}
            />
          </div>
          <div className="mb-5 mt-5">
            <button
              className="btn btn-primary"
              onClick={() => handleClickWithDelay(saveOrder)}
              style={{ marginRight: "10px", fontSize: "13px" }}
              disabled={isButtonDisabled} // Disable the button conditionally
            >
              Save Order
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleClickWithDelay(saveFilters)}
              style={{ marginRight: "10px", fontSize: "13px" }}
              disabled={isButtonDisabled} // Disable the button conditionally
            >
              Save Filters
            </button>
            <button className="btn btn-secondary" onClick={resetOrder}>
              Reset
            </button>
          </div>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </section>
    </>
  );
};

export default UsageLogSetting;
