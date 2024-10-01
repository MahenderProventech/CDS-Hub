import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import http from './Http';
const FunctionDropdown = ({ handleButtonClick, index }) => {
  const [functions, setFunctions] = useState([]);

  useEffect(() => {
    // Fetch default functions from API when the component mounts
    // fetch('http://localhost:58747/api/Formulas/GetDefaultFunctions')
    http.get('Formulas/GetDefaultFunctions')
      .then(response => response.json())
      .then(data => {
        if (data.item2) {
          setFunctions(data.item2);
        }
      })
      .catch(error => console.error('Error fetching functions:', error));
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <Row>
      <Col>
        <DropdownButton id="dropdown-basic-button" className='DropdownFunctions' title="Select Function">
          {functions.map(func => (
            <Dropdown.Item key={func.id} onClick={() => handleButtonClick(index, func.functionName)}>
              {func.functionName}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Col>
    </Row>
  );
};

export default FunctionDropdown;








// import React from 'react';
// import { Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';

// const FunctionDropdown = ({ handleButtonClick }) => (
//   <Row  >
//     <Col>
//       <DropdownButton id="dropdown-basic-button" className='DropdownFunctions' title="Select Function">
//         <Dropdown.Item onClick={() => handleButtonClick('Sum( )')}>
//           Sum( )
//         </Dropdown.Item>
//         <Dropdown.Item onClick={() => handleButtonClick('Avg( )')}>
//           Average( )
//         </Dropdown.Item>
//         {/* Add more Dropdown.Items for other functions */}
//       </DropdownButton>
//     </Col>
//   </Row>
// );

// export default FunctionDropdown;
