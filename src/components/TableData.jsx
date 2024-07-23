import React from 'react';

const TableDataComponent = ({ tableData }) => {
  console.log(tableData)
  // Dummy data array

  return (
    // <section className="full_screen">

    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: '20px', backgroundColor:'aliceblue' }}>
      <thead>
        <tr style={{ background: "lightgray" }}>
          <th style={{ border: "1px solid black", padding: "10px" }}>S.No</th>
          <th style={{ border: "1px solid black", padding: "10px" }}>Description</th>
          <th style={{ border: "1px solid black", padding: "10px" }}>Formula</th>
          <th style={{ border: "1px solid black", padding: "10px" }}>Raw Value</th>
          <th style={{ border: "1px solid black", padding: "10px" }}>Rounded Value</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((item, index) => (
          <tr key={item.id}>
            <td style={{ border: "1px solid black", padding: "10px" }}>{index + 1}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{item.formulaDispayDescription}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{item.formula}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{item.rawValue}</td>
            <td style={{ border: "1px solid black", padding: "10px" }}>{item.roundedValue}</td>
          </tr>
        ))}
      </tbody>
    </table>
    // </section>
  );
};

export default TableDataComponent;
