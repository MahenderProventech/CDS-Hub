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
import UserContext from './UserContext';




const ExecApproveFormulaByID = () => {    
  const location = useLocation();
  const currentUrl = location.pathname;
  const urlParts = currentUrl.split('/');
  const id = urlParts[urlParts.length - 1];

  console.log("ID:", id);

  const [comments, setComments] = useState('');

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };
  const [isDisabled, setIsDisabled] = useState(true);

  const [accordionCount, setAccordionCount] = useState(1);
  const [formulas, setFormulas] = useState([]); // State to store formulas for each accordion item


  const [roundedUpto, setroundedUpto] = useState('');
  const [labelDescription, setLabelDescription] = useState('');

  // Handle input change
  const handleLabelDescriptionChange = (event) => {
    setLabelDescription(event.target.value);
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
  const [responseData, setResponseData] = useState(null);
  const [descInput, setDescInput] = useState("")
  const params = useParams();
  const [groupNameData, setgroupNameData] = useState('');
  const [formulTestName, setTestName] = useState('');
  const [childFormulaTypesObj, setChildFormulaTypesObj] = useState([]);



  const navigate = useNavigate();
  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Formula Status Updated Successfully.',

      icon: 'info',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/home/execReviewDashboard")
        // Swal.fire('You clicked the confirm button!', '', 'success');
      }
    });
  };






  useEffect(() => {

    if (params.hasOwnProperty("id")) {
      http.get(`ExecutionFormula/GetExecutionFormulaById?formulaId=${params.id}`).then((resp) => {
        console.log("GetFormulaById resp", resp.data.item2);
        let apiResponse = resp.data.item2;
        // Update main formula and description
        setLabelDescription(resp.data.item2.labelDescription);
        setTestName(resp.data.item2.testName);
        setgroupNameData(resp.data.item2.groupvalue);
        // Update variable inputs
        setVariableInputs(apiResponse.executionFormulaVariableInfo);
        // Update formulas array with main formula and child formulas
        let formulasArray = [];
        formulasArray.push(resp.data.item2.formula); // Add main formula
        setFormulas(formulasArray);
        setChildFormulaTypesObj(apiResponse.executionChildFormula);
        console.log("setChildFormulaTypesObj", setChildFormulaTypesObj)

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



  const showView = (viewNumber) => {
    setCurrentView(viewNumber);
  };

  const clickLeftArrow = () => {
    $(".leftSide").toggleClass("closed");
    $(".rightSide").toggleClass("closed");
  }

  const handleAddVariable = () => {
    const newVariable = {
      id: variableInputs.length + 1,
      variable: '',
      label: '',
      uom: '',
      displayFormat: '',
      roundedUpTo: '',
      values: []
    };
    setVariableInputs([...variableInputs, newVariable]);
  };



  const [expression, setExpression] = useState([])

  const handleVariableInputChange = (property, value, index) => {
    const updatedVariables = [...variableInputs];
    updatedVariables[index][property] = value;
    setVariableInputs(updatedVariables);
    let e = formulas
    let valueMap = {};
    updatedVariables.forEach(item => {
      valueMap[item.label] = item.values;
    });
    Object.keys(valueMap).forEach(label => {
      let regex = new RegExp('\\b' + label + '\\b', 'g');
      // e = e.replace(regex, valueMap[label]);
      e = e.map(x => x.replace(regex, valueMap[label]))

    });
    console.log("e", e)
    setExpression(e)
  };



  const formulaString = variableInputs.map(input => input.label).join(' + ');

  const [state, setState] = useState({
    descInput: "",
    roundValue: 2
  })


  const [descriptions, setDescriptions] = useState(['']);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDescriptions(prevDescriptions => {
      const newDescriptions = [...prevDescriptions];
      newDescriptions[name] = value; // Update the description at the corresponding index
      return newDescriptions;
    });
  };
  const [getLabel, setgetLabel] = useState(['']);
  const handlegetLabelChange = (e) => {
    const { name, value } = e.target;
    setgetLabel(prevgetLabel => {
      const newgetLabel = [...prevgetLabel];
      newgetLabel[name] = value; // Update the description at the corresponding index
      return newgetLabel;
    });
  };
  const [getUOM, setgetUOM] = useState(['']);
  const handlegetUOMChange = (e) => {
    const { name, value } = e.target;
    setgetUOM(prevgetUOM => {
      const newgetUOM = [...prevgetUOM];
      newgetUOM[name] = value; // Update the description at the corresponding index
      return newgetUOM;
    });
  };

  const { userData } = React.useContext(UserContext);


  const showChildAlert = (callback) => {
    Swal.fire({
      title: 'Authentication Required',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
    <input type="text" id="username" class="swal2-input" value='${userData.employeeId}' disabled placeholder="Username" style="padding: 5px; width: 90%; font-size: 12px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc;">
    <input type="password" id="password" class="swal2-input" placeholder="Password" style="padding: 5px; width: 90%; font-size: 12px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc;">
    
  </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username')?.value;
        const password = Swal.getPopup().querySelector('#password')?.value;
  
        if (!username || !password) {
          Swal.showValidationMessage('Please enter username and password');
          return false;
        }
  
        return { username, password };
      },
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, password } = result.value;
        
        if (username === userData.employeeId) {
          const payload = {
            LoginId: username,
            Password: password
          };
          
          http.post("Login/AuthenticateData", payload)
            .then((resp) => {
              if (resp.data.item1) {
                callback();  // Execute the passed callback
              } else {
                Swal.fire('Authentication failed', 'Please enter valid details', 'error');
              }
            })
            .catch((err) => {
              console.log(err);
              Swal.fire('Authentication failed', 'Invalid username or password', 'error');
            });
        } else {
          Swal.fire('Authentication failed', 'Invalid username', 'error');
        }
      }
    });
  };
  
  // Alert for Invalid Comments
  const showInValidAlert = () => {
    Swal.fire({
      title: 'Error',
      text: 'Please enter comments.',
      icon: 'error',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  };
  
  // Function to Save Data (Approve)
  const saveData = async () => {
    if (!comments || !comments.trim()) { // Check if comments is null or empty
      showInValidAlert();
      return;
    }
    showChildAlert(async () => {
      try {
        const obj = {
          Status: "Approved",
          Id: params.id,
          Comments: comments
        };
        console.log("obj", obj);
  
        // Send the obj parameter to the server
        const resp = await http.post("ExecutionFormula/UpdateExecutionFormulaStatus", obj);
        console.log("resp", resp.data);
        showAlert();
      } catch (err) {
        console.log("err", err);
        // Handle errors here
      }
    });
  };
  
  // Function to Save Data (Reject)
  const saveRejectformula = async () => {
    if (!comments || !comments.trim()) { // Check if comments is null or empty
      showInValidAlert();
      return;
    }
    showChildAlert(async () => {
      try {
        const obj = {
          Status: "Rejected",
          Id: params.id,
          Comments: comments // Include comments in the request payload
        };
        console.log("obj", obj);
  
        // Send the obj parameter to the server
        const resp = await http.post("ExecutionFormula/UpdateExecutionFormulaStatus", obj);
        console.log("resp", resp.data);
        showAlert();
      } catch (err) {
        console.log("err", err);
        // Handle errors here
      }
    });
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
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Test Name</p>
                      <input
                        placeholder='Enter Formula Description'
                        className='formulaName'
                        value={formulTestName}
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
                   
                  </Row>
 

                  <InputVariableTable variableInputs={variableInputs} setVariableInputs={(obj) => setVariableInputs(obj)}
                  isDisabled={isDisabled}  />




                  {/* {console.log("formulas-new: ", formulas)} */}
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
                                        rows={1}  disabled/>
                                    </td>
                                    <td style={{ width: "300px" }}>
                                      <select name="formulaType" id="formulaType"
                                      // onChange={(e) => handleChange(e, index)}
                                      disabled
                                      >

                                        <option value="child">Child</option>
                                        <option value="final">Final</option>
                                      </select>
                                    </td>

                                    <td style={{ width: "100px" }}>
                                      <input placeholder='Enter Label' value={childFormulaTypesObj[index]?.['formulaTypelabel']} type="text"
                                        name="formulaTypelabel"
                                        
                                        // onChange={(e) => handleChange(e, index)}
                                        disabled
                                      />
                                    </td>
                                    <td>
                                      <select
                                        value={childFormulaTypesObj[index]?.['formulaTypeUOM']}
                                        name="formulaTypeUOM"
                                      disabled

                                      >
                                        <option value="">Select UOM</option>

                                      </select>
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


                  <Row>
                    <p className='mt-3' style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Add Comments </p>
                    <Col sm={7}>
                      <textarea
                        placeholder='Write comments '
                        style={{ width: '100%', height: '83px' }}
                        value={comments}
                        onChange={handleCommentsChange}
                      />
                    </Col>
                  </Row>
                  <div className="col text-end mt-4 mb-5">
                    <button
                      className='btn btn-primary'
                      onClick={saveData}
                      style={{ marginRight: "15px" }}
                    >
                      Approve
                    </button>
                    <button
                      className='btn btn-primary'
                      onClick={saveRejectformula}
                    >
                      Reject
                    </button>
                  </div>

                </div>
              </li>

            </ul>
          </section>

        </>
      )}
      {/* </Container> */}
    </>
  );
};

export default ExecApproveFormulaByID;
