import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';
import VariableInputRow, { replaceLabelsWithValue } from './VariableInputRow'; // Import replaceLabelsWithValue
import FunctionDropdown from './Dropdown';
import { FaPlus, FaDivide, FaPercentage, FaMinus, FaGreaterThan, FaLessThan, FaGreaterThanEqual, FaLessThanEqual } from "react-icons/fa";
import { FaStarOfLife } from "react-icons/fa6";
import { PiBracketsRoundBold } from "react-icons/pi";
import FormulaValidationApi from './FormulaValidationApi';
import DynamicAccordions from './DynamicAccordions';
import $ from 'jquery'
import './Dashboard.css';
import http from './Http';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import InputVariableTable from './InputVariables';
import TableDataComponent from './TableData';

const GetFormulaByIds = () => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const urlParts = currentUrl.split('/');
  const id = urlParts[urlParts.length - 1];

  console.log("ID:", id);
  const [status, setStatus] = useState(null);


  const [accordionCount, setAccordionCount] = useState(1);
  const [formulas, setFormulas] = useState([]); // State to store formulas for each accordion item


  const [roundedUpto, setroundedUpto] = useState('');
  const [labelDescription, setLabelDescription] = useState('');
  const [groupNameData, setgroupNameData] = useState('');
  const [formulTestName, setTestName] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);


  // Handle input change
  const handleLabelDescriptionChange = (event) => {
    setLabelDescription(event.target.value);
  };
  const [comments, setComments] = useState('');

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };



  const showChildAlert = () => {
    Swal.fire({
      title: 'Authentication Required',
      html: `
      <input type="text" id="username" class="swal2-input" placeholder="Username">
      <input type="password" id="password" class="swal2-input" placeholder="Password">
    `,
      focusConfirm: false,
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username').value;
        const password = Swal.getPopup().querySelector('#password').value;
        if (!username || !password) {
          Swal.showValidationMessage(`Please enter username and password`);
        }
        return { username: username, password: password };
      },
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, password } = result.value;
        if (username === 'User007' && password === '1234') {
          showAlert();
        } else {
          Swal.fire('Authentication failed', 'Invalid username or password', 'error');
        }
      }
    });
  };


  // Function to handle formula change for a specific accordion item
  const handleFormulaChange = (index, value) => {
    const newFormulas = [...formulas];
    newFormulas[index] = value;
    setFormulas(newFormulas);
  };
  // const handleFormulaChange = (index, value) => {
  //   const newFormulas = [...formulas];
  //   newFormulas[index] = value;
  //   setFormulas(newFormulas);
  // };
  const [currentView, setCurrentView] = useState(1);
  const [variableInputs, setVariableInputs] = useState([
    { id: 1, variable: '', label: '', uom: '', displayFormat: '', roundedUpTo: '', values: [] },
  ]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedValidateFunction, setSelectedValidateFunction] = useState('');
  const [formula, setFormula] = useState('');
  const [rawFormula, setRawFormula] = useState([]);
  const [rawValue, setRawValue] = useState('');
  const [roundedValue, setRoundedValue] = useState(0);
  const [responseData, setResponseData] = useState([]);
  const [descInput, setDescInput] = useState("");
  const [childFormulaTypesObj, setChildFormulaTypesObj] = useState([]);


  // const [response , setResponse] =useState('');
  const params = useParams();
  const navigate = useNavigate();
  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Comments are added Successfully.',

      icon: 'info',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/home/create-formula/${id}`)
        // Swal.fire('You clicked the confirm button!', '', 'success');
      }
    });
  };
  const handleEditClick = () => {
    setIsDisabled(false);
  };



  useEffect(() => {

    if (params.hasOwnProperty("id")) {
      http.get(`Formulas/GetFormulaById?formulaId=${params.id}`).then((resp) => {
        console.log("GetFormulaById resp", resp.data.item2);
        let apiResponse = resp.data.item2;
        // Update main formula and description
        setLabelDescription(resp.data.item2.labelDescription);
        setTestName(resp.data.item2.testName);
        setgroupNameData(resp.data.item2.groupvalue);
        // Update variable inputs
        setVariableInputs(apiResponse.formulaVariableInformation);
        // Update formulas array with main formula and child formulas
        let formulasArray = [];
        formulasArray.push(resp.data.item2.formula); // Add main formula
        setFormulas(formulasArray);
        setChildFormulaTypesObj(apiResponse.childFormulas);

      }).catch((err) => {
        console.log("error", err);
      });
    }
  }, [params.id]);

  const handleButtonClick = (index, text) => {
    const newFormula = formulas[index] + text;
    handleFormulaChange(index, newFormula);
    setRawFormula(prev => [...prev, text]);
  };

  return (
    <>
      {currentView === 1 && (
        <>
          <section className="full_screen">
            <ul className="inner">
              <li className="" style={{ width: "100%" }}>

                <div style={{ background: "#fff", padding: "2rem 2rem 0rem" }}>
                  <Row>
                    <Col sm={6}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Description</p>

                      <input
                        placeholder='Enter Formula Description'
                        className='formulaName'
                        value={labelDescription}
                        onChange={handleLabelDescriptionChange}
                        disabled
                      />
                    </Col>

                    <Col sm={2}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Group Name</p>
                      <input
                        placeholder='Enter Formula Description'
                        className='formulaName'
                        value={groupNameData}
                        disabled

                      />
                    </Col>
                    <Col sm={2}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Test Name</p>
                      <input
                        placeholder='Enter Formula Description'
                        className='formulaName'
                        value={formulTestName}
                        disabled

                      />
                    </Col>
                  </Row>


                  <InputVariableTable variableInputs={variableInputs} setVariableInputs={(obj) => setVariableInputs(obj)} isDisabled={isDisabled}
                  />


                  {

                    childFormulaTypesObj.map((_, index) => (

                      <div key={index}>

                        <Accordion defaultActiveKey="1">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <table className="mainTable" style={{ fontSize: "12px" }} disabled>
                                <thead>
                                  <tr>
                                    <th>Description  <span style={{ color: 'red' }}>*</span></th>
                                    <th>Type of Formula  <span style={{ color: 'red' }}>*</span></th>

                                    <th>Label  <span style={{ color: 'red' }}>*</span></th>

                                    <th>UOM  <span style={{ color: 'red' }}>*</span></th>
                                    <th></th>
                                    <th width="200"></th>
                                    <th></th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="ui-sortable-handle" onClick={(e) => { e.stopPropagation(); }}>
                                    <td style={{ width: "500px" }}>
                                      <input type="text" placeholder="Description" className=" descInput "
                                        value={childFormulaTypesObj[index]?.['formulaDispayDescription']}
                                        name="formulaDispayDescription"
                                        // onChange={(e) => handleChange(e, index)}
                                        rows={1} disabled />
                                    </td>
                                    <td style={{ width: "300px" }}>
                                      {/* <select name="formulaType" id="formulaType"
                                      // onChange={(e) => handleChange(e, index)}
                                      >
                                        <option value="child">Child</option>
                                        <option value="final">Final</option>
                                      </select> */}
                                      <input placeholder='Enter Label' value={childFormulaTypesObj[index]?.['formulaType']} type="text"
                                        name="formulaType"
                                        // onChange={(e) => handleChange(e, index)}
                                        disabled
                                      />
                                    </td>

                                    <td style={{ width: "100px" }}>
                                      <input placeholder='Enter Label' value={childFormulaTypesObj[index]?.['formulaTypelabel']} type="text"
                                        name="formulaTypelabel"
                                        // onChange={(e) => handleChange(e, index)}
                                        disabled
                                      />
                                    </td>
                                    <td>
                                      {/* <select
                                        // value={childFormulaTypesObj[index]?.['formulaTypeUOM']}
                                        name="formulaTypeUOM" defaultValue={childFormulaTypesObj[index]?.['formulaTypeUOM']}
                                      >
                                        <option value="">Select UOM</option>
                                      </select> */}
                                      <input placeholder='Enter Label' value={childFormulaTypesObj[index]?.['formulaTypeUOM']} type="text"
                                        name="formulaTypeUOM"
                                        // onChange={(e) => handleChange(e, index)}
                                        disabled
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="symbMain">
                                <span className="symbol" onClick={() => handleButtonClick(index, '+')}><FaPlus /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '-')}><FaMinus /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '*')}><FaStarOfLife /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '/')}><FaDivide /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '%')}><FaPercentage /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '<')}><FaLessThan /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '>')}><FaGreaterThan /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '≤')}><FaLessThanEqual /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '≥')}><FaGreaterThanEqual /></span>
                                <span className="symbol" onClick={() => handleButtonClick(index, '( )')}><PiBracketsRoundBold /></span>
                                <div className="formulaMain">
                                  <span>fx</span>
                                  <FunctionDropdown className="DropdownFunctions" handleButtonClick={handleButtonClick} index={index} />

                                </div>
                              </div>
                              <textarea
                                className='formulaEdit'
                                rows={3}
                                value={childFormulaTypesObj[index]?.['formula']}
                                onChange={(e) => {
                                  handleFormulaChange(index, e.target.value);
                                  setRawFormula((prev) => [...prev, e.target.value]);
                                }}
                                disabled
                              ></textarea>

                            </Accordion.Body>
                          </Accordion.Item>
                          {/* <button className="btn btn-primary" onClick={saveData}>Save</button> */}
                        </Accordion>
                        <div className="col text-end">



                        </div>

                      </div>


                    ))}

                  <TableDataComponent tableData={childFormulaTypesObj} />

                  <div className="col text-end mt-4 mb-5">

                    {status !== "Approved" && (

                      <Link to={`/home/create-formula/${id}`}>
                        <button
                          className='btn btn-primary'
                          onClick={handleEditClick}
                        >
                          Edit
                        </button></Link>

                    )}
                  </div>

                </div>
              </li>

            </ul >
          </section >

        </>
      )}


      {/* </Container> */}
    </>
  );
};

export default GetFormulaByIds;
