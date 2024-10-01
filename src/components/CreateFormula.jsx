import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Accordion, Form } from 'react-bootstrap';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';
import VariableInputRow, { replaceLabelsWithValue } from './VariableInputRow'; // Import replaceLabelsWithValue
import FunctionDropdown from './Dropdown';
import { FaPlus, FaDivide, FaPercentage, FaMinus, FaGreaterThan, FaLessThan, FaGreaterThanEqual, FaLessThanEqual } from "react-icons/fa";
import { FaStarOfLife } from "react-icons/fa6";
import { PiBracketsRoundBold } from "react-icons/pi";
import $ from 'jquery'
import './Dashboard.css';
import http from './Http';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import UserContext from './UserContext';
import * as AppConstant from '../services/AppConstantService';
import InputVariableTable from './InputVariables';
// import { replaceVariables } from '../services/FormulaUtils';
const CreateFormula = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accordionCount, setAccordionCount] = useState(0);
  const [formulas, setFormulas] = useState([]); // State to store formulas for each accordion item
  const [labelDescription, setLabelDescription] = useState('');
  const [TestName, setTestName] = useState('');
  const [reference, setReference] = useState('');
  const [roundedValue, setRoundedValue] = useState();
  const [formulaGroups, setFormulaGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [formulaCode, setFormulaCode] = useState(null);
  const [currentView, setCurrentView] = useState(1);
  const [variableInputs, setVariableInputs] = useState([
    { id: 0, variable: '', variableLabel: '', uom: '', variableDisplayFormat: '', roundsUpto: 0, values: [] },
  ]);
  const [isFinalTypeSelected, setIsFinalTypeSelected] = useState(false);

  const [errors, setErrors] = useState({
    labelDescriptionError: '',
    testNameError: '',
    roundedValueError:'',
    selectedGroupError:''
  });

  const [childFormulaTypesObj, setChildFormulaTypesObj] = useState([{
    id: 0,
    formulaDispayDescription: '',
    formulaTypelabel: '',
    formulaTypeUOM: '',
    formulaType: 'child',
    formula: "",
    rawValue: '',
    roundedValue: '',
    parentFormulaId: 0
  }]);
  const [idleTimer, setIdleTimer] = useState(null);
  useEffect(() => {
    fetchUOMs();
    const resetIdleTimer = () => {
      // Clear existing idle timer
      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      // Set new idle timer
      const newIdleTimer = setTimeout(() => {
        saveData('', 'save');
      }, 150 * 60 * 1000); // 15 minutes in milliseconds
      setIdleTimer(newIdleTimer);
    };

    // Add event listeners to reset the idle timer
    const resetIdleTimerEvents = () => {
      ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        window.addEventListener(event, resetIdleTimer);
      });
    };

    resetIdleTimerEvents(); // Start listening to events
    resetIdleTimer(); // Initial call to set the idle timer

    return () => {
      ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearTimeout(idleTimer); // Clear idle timer on unmount
    };


  }, []);

  const handleAddAccordion = () => {
    console.log("params ", params)
    setAccordionCount(prevCount => prevCount + 1);
    setFormulas(prevFormulas => [...prevFormulas, '']); // Add an empty formula for the new accordion\
    setChildFormulaTypesObj([...childFormulaTypesObj, ...[{
      id: 0,
      formulaDispayDescription: '',
      formulaTypelabel: '',
      formulaTypeUOM: '',
      formulaType: 'child',
      formula: "",
      rawValue: '',
      roundedValue: '',
      parentFormulaId: params ? params.id : 0
    }]])
  };

  // const handleRemoveAccordion = (indexToRemove) => {
  //   setAccordionCount(prevCount => prevCount - 1);
  //   setFormulas(prevFormulas => prevFormulas.filter((_, index) => index !== indexToRemove));
  // };
  const handleRemoveAccordion = (indexToRemove) => {
    const updatedFormulas = childFormulaTypesObj.filter((_, index) => index !== indexToRemove);
    setChildFormulaTypesObj(updatedFormulas);
  };



  // Handle input change
  const handleLabelDescriptionChange = (event) => {
    setLabelDescription(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      labelDescriptionError: ''
    }));
  };
  const handleTestNameChange = (event) => {
    setTestName(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      testNameError: ''
    }));
  };
  const handleRoundedValueChange = (event) => {
    setRoundedValue(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      roundedValueError: ''
    }));
  };
  const handleSelectedGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedGroupError: ''
    }));
  };

  const handleReferenceChange = (event) => {
    setReference(event.target.value);
  };


  // Function to handle formula change for a specific accordion item
  const handleFormulaChange = (index, value) => {
    const newFormulas = [...formulas];
    newFormulas[index] = value;
    setFormulas(newFormulas);
  };


  const params = useParams();
  const navigate = useNavigate();

  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Formula ID Is Created Successfully.',

      icon: 'info',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/home/master-dashboard")
        // Swal.fire('You clicked the confirm button!', '', 'success');
      }
    });
  };
  const showChildAlert = (saveval) => {
    console.log(saveval)
    let message=saveval==0?'Formula label description already exist':'Saved Successfully.';
    Swal.fire({
      title: '',
      text: message,
      icon: 'info',
      confirmButtonText: 'Ok',
      

    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        navigate(`../../home/create-formula/${saveval}`);
        fetDataById();
      }
    });
  
  };


  useEffect(() => {

    fetchFormulaGroups();

    console.log("params", params);

    if (params.hasOwnProperty("id")) {
   
      fetDataById();
  
    }

  }, [params.id]);

   const fetDataById = () => {
   // console.log(params.id);
    http.get(`Formulas/GetFormulaById?formulaId=${params.id}`).then((resp) => {
      console.log("GetFormulaById resp", resp.data.item2);
      let apiResponse = resp.data.item2;
       
      setAccordionCount(resp.data.item2.childFormulas.length);

      setRoundedValue(resp.data.item2.roundedUpto);

      // Update main formula and description

      setSelectedGroup(resp.data.item2.groupvalue)

      setFormulaCode(resp.data.item2.formulaCode);

      setReference(resp.data.item2.reference);

      setLabelDescription(resp.data.item2.labelDescription);

      setTestName(resp.data.item2.testName);

      // Update variable inputs

      setVariableInputs(apiResponse.formulaVariableInformation);

      // Update formulas array with main formula and child formulas

      let formulasArray = [];

      formulasArray.push(resp.data.item2.formula); // Add main formula

      setChildFormulaTypesObj(apiResponse.childFormulas);

      setFormulas(formulasArray);



    }).catch((err) => {

      console.log("error", err);

    });

  }
 

  const handleButtonClick = (index, symbol) => {
    const updatedFormulas = [...childFormulaTypesObj];
    updatedFormulas[index].formula += symbol;
    setChildFormulaTypesObj(updatedFormulas);
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
      "id": 0,
      "variable": "",
      "uom": "",
      "variableDisplayFormat": "",
      "variableLabel": "",
      "roundsUpto": 0,
      "values": []
    }
    console.log(newVariable)
    setVariableInputs([...variableInputs, newVariable]);
  };

  const handleRemoveVariable = (indexToRemove) => {
    // if (variableInputs.length > 1) {
    //   const updatedVariables = variableInputs.slice(0, variableInputs.length - 1);
    //   setVariableInputs(updatedVariables);
    // }
    const updatedRows = variableInputs.filter((row, index) => index !== indexToRemove);
    setVariableInputs(updatedRows);
  };

  const [expression, setExpression] = useState([])

  const handleVariableInputChange = (property, value, index) => {
    console.log(property)
    console.log(value)
    console.log(index);
    const updatedVariables = [...variableInputs];

    if (property == 'values') {
      updatedVariables[index]['variableDisplayFormat'] = value;
    }
    updatedVariables[index][property] = value;
    console.log(updatedVariables)
    setVariableInputs(updatedVariables);
  };

  // const [descriptions, setDescriptions] = useState(['']);
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log(name)
    console.log(value);
    const objData = [...childFormulaTypesObj];

    if (name == "formulaType" && value == 'final') {
      objData[index]['formulaTypelabel'] = '';

    }
    objData[index][name] = value;

    setChildFormulaTypesObj(objData);
  };


  const showChildAlert1 = () => {
    Swal.fire({
      title: 'Authentication Required',
      html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
    <input type="text" id="username" class="swal2-input" value='${userData.employeeId}' disabled placeholder="Username" style="padding: 5px; width: 90%; font-size: 12px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc;">
    <input type="password" id="password" class="swal2-input" placeholder="Password" style="padding: 5px; width: 90%; font-size: 12px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc;">
    <textarea id="swal-comments" class="swal2-input" placeholder="Comments" style="padding: 5px; width: 90%; margin-top: 10px; font-size: 12px; height: 80px; border-radius: 4px; border: 1px solid #ccc;"></textarea>
  </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username').value;
        const password = Swal.getPopup().querySelector('#password').value;
        const swalComments = Swal.getPopup().querySelector('#swal-comments').value;
        
        if (!username || !password) {
          Swal.showValidationMessage('Please enter username and password');
          return false;
        }
  
        if (swalComments === "") {
          Swal.showValidationMessage('Please add comments');
          return false;
        }
  
        return { username, password, swalComments };
      },
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, password, swalComments } = result.value;
        
        if (username === userData.employeeId) {
          const payload = {
            LoginId: username,
            Password: password
          };
          
          http.post("Login/AuthenticateData", payload)
            .then((resp) => {
              if (resp.data.item1) {
                saveData(swalComments, 'create');
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
  


  const { userData } = React.useContext(UserContext);

  const saveData = async (swalComments, type) => {
    if (!labelDescription || !TestName || !roundedValue ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        labelDescriptionError: !labelDescription ? 'Description is required' : '',
        testNameError: !TestName ? 'Test Name is required' : '',
        roundedValueError: !roundedValue ? 'Round up to value is required' : '',
        selectedGroupError: !selectedGroup ? 'Group Name is required' : ''

      }));
      return;
    }
    
    console.log(params.id);
    try {
      const formulasArray = [];
      // const descriptionsArray = [];
      // const formulaTypeArray = [];
      let formulaVariableInformation = variableInputs;
      // descriptionsArray.push(...descriptions);
      const obj = {
        id: params.id ? params.id : 0,
        createdBy: userData.firstName + '/' + userData.employeeId,
        comments: swalComments,
        groupvalue: selectedGroup,
        labelDescription: labelDescription,
        reference: reference,
        formulaEditedFrom: 0,
        testName: TestName,
        roundedUpto: roundedValue,
        formulaCode: formulaCode,
        hasChildFormula: formulasArray.length > 0,
        formulaVariableInformation, // Add formulaVariableInformation here
        childFormulas: childFormulaTypesObj
      };

      console.log("obj", obj);
      if (type == "save") {
        const resp = await axios.post(AppConstant.saveFormula, obj);
        // setSaveDataId(resp.data.item2);
        showChildAlert(resp.data.item2);

      } else {
        const resp = await axios.post(AppConstant.submitFormula, obj);
        console.log(resp)
        if (resp.data.item1) {
          showAlert();
          // showChildAlert1(resp.data.item2);
        }
      }
    } catch (err) {
      console.log("err", err);
      // Handle errors here
      alert(err.message);

    }
  };

  const [validationData, setValidationData] = useState([]);
  const handleValidation = () => {
    let data = [];

    let allChildValues = [...variableInputs];
    let valueMap = {};
    let expressions = [];
    console.log(variableInputs);
    console.log(childFormulaTypesObj)
    childFormulaTypesObj.forEach((value, key) => {
      let val = value.formula;

      allChildValues.forEach(item => {
        valueMap[item.variableLabel] = item.variableDisplayFormat;
      });
      Object.keys(valueMap).forEach(label => {
        let regex = new RegExp('\\b' + label + '\\b', 'g');
        [val] = [val].map(x => x.replace(regex, valueMap[label]));
      });
      allChildValues.push({
        "variable": "var",
        "variableLabel": value.formulaTypelabel,
        "uom": value.formulaTypeUOM,
        "variableDisplayFormat": val,
        "roundsUpto": "",
        "values": []
      });
      console.log({ expression: val, formula: value.formula });
      data.push({ expression: val, formula: value.formula });
      expressions.push(val)
    });
    setValidationData(data)
    const context = {
      Avg,
      Max,
      Min,
      Log10,
      Exp,
      Pow,
      Sqrt,
      STDEV,
      STDEV_P,
      RSD,
      Sum,
      ROUND,
      Math, // Include Math for built-in functions
    };

    const results = expressions.map((expression, index) => {
      console.log(`Evaluating expression ${index + 1}: ${expression}`);
      try {
        // Use Function constructor to evaluate expression in the context
        const innerExpressionResult = new Function(
          ...Object.keys(context),
          `return (${expression});`
        )(...Object.values(context));
        console.log(`Result for expression ${index + 1}: ${innerExpressionResult}`);
        if (isNaN(innerExpressionResult)) {
          console.warn(`Warning: Result for expression ${index + 1} is NaN`);
        }
        let obj = { val: innerExpressionResult };
        console.log(obj)
        setChildFormulaTypesObj((prev) => {
          console.log(prev)
          let updatedVals = prev;
          updatedVals[index]['rawValue'] = JSON.stringify(innerExpressionResult);
          updatedVals[index]['roundedValue'] = innerExpressionResult.toFixed(roundedValue);
          return updatedVals;
        })
        return innerExpressionResult;
      } catch (error) {
        console.error(`Error evaluating expression ${index + 1}:`, error);
        return null;
      }
    });
    console.log(results);
  };

  // Define Sum function
function Sum(values) {
  return values.reduce((acc, val) => acc + val, 0);
}

// Define Avg function
function Avg(...values) {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

// Define Max function
function Max(...values) {
  return Math.max(...values);
}

// Define Min function
function Min(...values) {
  return Math.min(...values);
}

// Define STDEV function
function STDEV(...values) {
  const count = values.length;
  const mean = Avg(...values);
  const squareDiffs = values.map(value => (value - mean) ** 2);
  const sumSquareDiff = Sum(squareDiffs);
  const countSumSquareDiff = sumSquareDiff / (count - 1);
  const sqrtCountSumSquareDiff = Math.sqrt(countSumSquareDiff);
  return sqrtCountSumSquareDiff;
}

// Define STDEV_P function
function STDEV_P(...values) {
  const count = values.length;
  const mean = Avg(...values);
  const squareDiffs = values.map(value => (value - mean) ** 2);
  const sumSquareDiff = Sum(squareDiffs);
  const variance = sumSquareDiff / count;
  const stdDev = Math.sqrt(variance);
  return stdDev;
}

// Define RSD function
function RSD(...values) {
  const mean = Avg(...values);
  const standardDeviation = STDEV(...values);
  return (standardDeviation / mean) * 100;
}

// Define ROUND function
function ROUND(value, decimals) {
  if (isNaN(value)) {
    console.warn(`Warning: Attempting to round NaN value`);
    return 0;
  }
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// Define Log10 function
function Log10(value) {
  if (value <= 0) {
    console.warn(`Warning: Log10 not defined for non-positive values`);
    return NaN;
  }
  return Math.log10(value);
}

// Define Exp function
function Exp(value) {
  return Math.exp(value);
}

// Define Pow function
function Pow(base, exponent) {
  return Math.pow(base, exponent);
}

// Define Sqrt function
function Sqrt(value) {
  if (value < 0) {
    console.warn(`Warning: Sqrt not defined for negative values`);
    return NaN;
  }
  return Math.sqrt(value);
}


  const fetchFormulaGroups = async () => {
    try {
      const response = await http.get('Configuration/GetFormulaGroups');
      if (response.data && response.data.item1) {
        setFormulaGroups(response.data.item2);
      } else {
        console.error('Unexpected response format', response);
      }
    } catch (error) {
      console.error('Error fetching formula groups:', error.response ? error.response.data : error.message);
    }
  };



  useEffect(() => {
    console.log(childFormulaTypesObj)
    const finalTypeExists = childFormulaTypesObj.some(obj => obj.formulaType === 'final');
    setIsFinalTypeSelected(finalTypeExists);
  }, [childFormulaTypesObj]);

  const [uomOptions, setUomOptions] = useState([]);

  // useEffect(() => {
  //   // Fetch UOM options from the API
  //   fetchUOMs();
  // }, []);
  const fetchUOMs = async () => {
    try {
      const response = await http.get("Configuration/GetUOM");
      if (response.data.item1) {
        setUomOptions(response.data.item2);
      }
    } catch (error) {
      console.error("Error fetching UOMs:", error);
    }
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
                    <Col sm={5}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600", fontSize: '11px', marginBottom: '2px' }}>Formula Description <span style={{ color: 'red' }}>*</span></p>
                      <input
                        placeholder='Enter Description'
                        className='formulaName'
                        value={labelDescription}
                        onChange={handleLabelDescriptionChange}
                      />
                      <Form.Text className="text-danger">{errors.labelDescriptionError}</Form.Text>

                    </Col>
                    <Col sm={3}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600", fontSize: '11px', marginBottom: '2px' }}>Test Name  <span style={{ color: 'red' }}>*</span></p>
                      <input
                        placeholder='Enter Test Name'
                        className='formulaName'
                        value={TestName}
                        onChange={handleTestNameChange}
                      />
                    <Form.Text className="text-danger">{errors.testNameError}</Form.Text>
                    </Col>
                    <Col sm={3}>
        <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600", fontSize: '11px', marginBottom: '2px' }}>
          Select Group Name <span style={{ color: 'red' }}>*</span>
        </p>
        <select
          className="groupByName1"
          value={selectedGroup}
          onChange={handleSelectedGroupChange}
        >
          <option value="" disabled selected>Select Group Name</option>
          {formulaGroups.map(group => (
            <option key={group.id} value={group.configureValue}>
              {group.configureValue}
            </option>
          ))}
        </select>
        <Form.Text className="text-danger">{errors.selectedGroupError}</Form.Text>
      </Col>
                  </Row>

                  <table className="mainTable mt-1" >
                    <thead>
                      <tr>
                        {/* <th width="40"></th> */}
                        <th width="60" className="">S. No.  <span style={{ color: 'red' }}>*</span></th>
                        <th width='700px'>Input Variables  <span style={{ color: 'red' }}>*</span></th>
                        <th>Label  <span style={{ color: 'red' }}>*</span></th>
                        <th>UOM 
                           {/* <span style={{ color: 'red' }}>*</span> */}
                        </th>
                        <th width="200">   </th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        variableInputs.map((variable, index) => {
                          return <tr className="ui-sortable-handle">
                            {/* <td className="text-center" valign="center"></td> */}

                            <td><input type="text" className="text-center" placeholder={`${index + 1}`} readOnly style={{ position: 'relative' }} /></td>

                            <td><input type="text" placeholder={`Enter Variable ${index + 1}`}
                              value={variable.variable}
                              className='variablesInput'
                              onChange={(e) => {
                                const updatedVariables = [...variableInputs];
                                updatedVariables[index].variable = e.target.value;
                                setVariableInputs(updatedVariables);
                              }} /></td>


                            <td>
                              <input
                                type="text"
                                placeholder={`Enter Label ${index + 1}`}
                                value={variable.variableLabel}
                                className='variablesInput'
                                onChange={(e) => {
                                  console.log(e.target.value)
                                  console.log(index)
                                  const updatedVariables = [...variableInputs];
                                  updatedVariables[index]['variableLabel'] = e.target.value.trim();
                                  console.log(updatedVariables)
                                  setVariableInputs(updatedVariables);
                                }}
                              />
                            </td>

                            <td>
                              <select
                                className='variablesInput'
                                value={variable.uom}
                                onChange={(e) => {
                                  const updatedVariables = [...variableInputs];
                                  updatedVariables[index]['uom'] = e.target.value;
                                  setVariableInputs(updatedVariables);
                                }}
                              >
                                <option value="">Select UOM</option>
                                {uomOptions.map(uom => (
                                  <option key={uom.id} value={uom.name}>{uom.name}</option>
                                ))}
                              </select>
                            </td>

                            {
                              variableInputs.length > 1 &&
                              <button className='me-2' style={{ marginLeft: '1px' }} onClick={() => handleRemoveVariable(index)}>
                                <CiCircleMinus className='circlePlus' />
                              </button>
                            }
                            {index == variableInputs.length - 1 &&
                              <button className='me-2' onClick={handleAddVariable}>
                                <CiCirclePlus className='circlePlus' />
                              </button>
                            }
                          </tr>
                        })
                      }
                    </tbody>
                  </table>

                  {

                    childFormulaTypesObj.map((obj, index) => (    

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
                                        onChange={(e) => handleChange(e, index)} rows={1} />
                                    </td>
                                    <td style={{ width: "300px" }}>
                                      <select name="formulaType" id="formulaType"
                                        onChange={(e) => handleChange(e, index)}
                                        value={childFormulaTypesObj[index]?.['formulaType']}
                                      >

                                        <option value="child">Child</option>
                                        <option value="final">Final</option>
                                      </select>
                                    </td>

                                    <td style={{ width: "100px" }}>
                                      <input placeholder='Enter Label' value={obj['formulaTypelabel']} type="text"
                                        name="formulaTypelabel"
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={childFormulaTypesObj[index]?.['formulaType'] === 'final'}
                                      />
                                    </td>
                                    <td>
                                      <select
                                          value={obj['formulaTypeUOM']}
                                        name="formulaTypeUOM"
                                        // onChange={(e) => handleFormulaUOMChange(e, index)}
                                        onChange={(e) => handleChange(e, index)}
                                      >
                                        <option value="">Select UOM</option>
                                        {uomOptions.map(uom => (
                                          <option key={uom.id} value={uom.name}>{uom.name}</option>
                                        ))}
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
                                name="formula"
                                value={childFormulaTypesObj[index]?.['formula']}
                                onChange={(e) =>
                                  handleChange(e, index)
                                  // handleFormulaChange(index, e.target.value);
                                  // setRawFormula((prev) => [...prev, e.target.value]);
                                }
                              ></textarea>

                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                        <div className="col text-end" style={{ marginTop: "-25px" }}>

                          <button className='me-2' style={{ marginLeft: '20px' }} onClick={() => handleRemoveAccordion(index)}>
                            <CiCircleMinus className='circlePlus' />
                          </button>

                        </div>
                      </div>

                    ))}
                  <div className="py-1">
                    <div className="row" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                      <div className="col text-end">
                      <button
              className="btn btn-primary"
              onClick={handleAddAccordion}
              // disabled={isFinalTypeSelected}
            >
              Add Formula
            </button>
                      </div>
                    </div>
                  </div>

                  
        <h5 className='description' style={{ fontSize: '11px' }}>
          Round up to: <span style={{ color: 'red' }}>*</span>
        </h5>
        <input
          type='number'
          className='descInput mb-1'
          value={roundedValue}
          placeholder=""
          name='roundValue'
          min={0}
          style={{ width: "20%", marginBottom:'0px !important' }}
          onChange={handleRoundedValueChange}
        />
            <Form.Text className="text-danger">{errors.roundedValueError}</Form.Text>
                  <div className="py-1">
                    <div className="row" style={{ paddingRight: "25px" }}>
                      <div className="col-sm-2">
                        <Link to={"/home/master-dashboard"}>
                          <button
                            className='btn btn-primary'
                          >
                            Back
                          </button>
                        </Link>
                      </div>

                      <div className="col text-end">
                        <button class="btn btn-primary" onClick={() => saveData('', 'save')} style={{ marginRight: '10px' }} >Save</button>
                        <button
                          className={currentView === 2 ? 'active btn btn-primary' : 'btn btn-primary'}
                          onClick={() => showView(2)}
                        >
                          Validate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

            </ul>
          </section>

        </>
      )
      }

      {
        currentView === 2 && (
          <>
            <section class="full_screen">
              <ul class="inner">
                <li class="leftSide">
                  <Col sm={12}>
                    <Row>
                      <Col>
                        <p className='dashboardCreate'><Link to={"/home/master-dashboard"}>Dashboard</Link><span style={{ cursor: 'pointer' }} className={currentView === 1 ? 'active' : ''}
                          onClick={() => showView(1)}> / Create</span><span style={{ color: "#707070" }}> / Validate</span> </p>
                      </Col>
                    </Row>

                    <Row className='fulBodyValidate'>
                      <Col>

                        <InputVariableTable variableInputs={variableInputs} setVariableInputs={(obj) => setVariableInputs(obj)} />


                      </Col>
                    </Row>
                    <Row className='fulBodyValidate'>
                      <Col className='createData' sm={12}>

                      </Col>
                    </Row>
                    <Row className='fulBodyValidate'>
                      <Col className='createData' sm={12}>
                        <h5 className='description'> Reference: <span style={{ color: 'red' }}>*</span></h5>

                        <input type='text' className='descInput'
                          placeholder=""
                          value={reference}
                          onChange={handleReferenceChange} />
                      </Col>
                    </Row>
                    <Row className='fulBodyValidate'>
                      <Col sm={3}>
                        <br />
                      </Col>
                    </Row>
                  </Col>
                </li>
                <li class="rightSide">
                  <div class="toggle" id="varMenu" onClick={clickLeftArrow}><span class="material-icons">arrow_left</span></div>
                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">Calculated Generated</label>
                    <div class="textAreFC">
                      {validationData.map((item, index) => (
                        <><div key={index}>
                          <p>
                            Formula {index + 1}: {item.formula} <br />
                            Expression{index + 1}={(item.expression || "")}
                          </p>
                        </div>
                          <div>
                            {childFormulaTypesObj?.length ?
                              <div>
                                <p>Raw Value: {childFormulaTypesObj?.[index]?.rawValue}</p>
                                <p>Rounded Value: {childFormulaTypesObj?.[index]?.roundedValue}</p>
                              </div>

                              : null
                            }
                          </div>
                        </>
                      ))}

                      {/* for validate button edit start */}
                      {/* {!responseData && ( */}
                      <button onClick={handleValidation} className='validationButton'>
                        Validate Formula
                      </button>
                      {/* )} */}
                      {/* for validate button edit end */}

                    </div>
                    <hr />
                    <div class="py-1">
                      <div class="row">
                        <div class="col">
                          <button
                            className={currentView === 1 ? ' btn btn-primary' : 'btn btn-primary'}
                            onClick={() => { showView(1); }}                      >
                            Back
                          </button>
                        </div>
                        <div class="col text-end">

                          <button class="btn btn-primary" onClick={showChildAlert1} style={{ fontSize: '55%' }} >Send For Approval</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          </>
        )
      }
      {/* </Container> */}
    </>
  );
};


export default CreateFormula;
