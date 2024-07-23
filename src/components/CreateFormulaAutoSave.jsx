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
import Dropdown from 'react-bootstrap/Dropdown';

const CreateFormula = () => {
  const [responseData, setResponseData] = useState(null);
  const [getLabel, setFormulaTypeLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accordionCount, setAccordionCount] = useState(1);
  const [formulas, setFormulas] = useState([]); // State to store formulas for each accordion item
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [formulaTypes, setFormulaTypes] = useState(['child']);
  const [labelDescription, setLabelDescription] = useState('');
  const [TestName, setTestName] = useState('');
  const [SaveDataId, setSaveDataId] = useState('');
  const [reference, setReference] = useState('');
  // const [selectedFunction, setSelectedFunction] = useState('');
  // const [selectedValidateFunction, setSelectedValidateFunction] = useState('');
  const [formula, setFormula] = useState('');
  const [rawFormula, setRawFormula] = useState([]);

  // const [rawValue, setRawValue] = useState('');
  const [roundedValue, setRoundedValue] = useState(0);
  const [formulaResponse, setformulaResponse] = useState({})
  const [formulaResponseArray, setformulaResponseArray] = useState([]);
  const [formulaGroups, setFormulaGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  const [childFormulasResp, setChildFormulasResp] = useState(null);

  const [formulaCode, setFormulaCode] = useState(null);
  const [comments, setComments] = useState('');


  const [currentView, setCurrentView] = useState(1);
  const [variableInputs, setVariableInputs] = useState([
    { id: 1, variable: '', label: '', uom: '', displayFormat: '', roundedUpTo: '', values: [] },
  ]);

  const [childFormulaTypesObj, setChildFormulaTypesObj] = useState([{}]);

  const [formulaInputs, setformulaVariableInformation] = useState(null);
  const [idleTimer, setIdleTimer] = useState(null);
  useEffect(() => {
    const resetIdleTimer = () => {
      // Clear existing idle timer
      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      // Set new idle timer
      const newIdleTimer = setTimeout(() => {
        saveChildData();
      }, 15 * 60 * 1000); // 15 minutes in milliseconds
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
      // Cleanup event listeners when component unmounts
      ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearTimeout(idleTimer); // Clear idle timer on unmount
    };
  }, []); // Empty dependency array to run the effect only once

  // Function to handle adding a new accordion
  const handleAddAccordion = () => { 
    setAccordionCount(prevCount => prevCount + 1);
    setFormulas(prevFormulas => [...prevFormulas, '']); // Add an empty formula for the new accordion\
    setChildFormulaTypesObj([...childFormulaTypesObj, ...[{
      // id: '',
      formulaDispayDescription: '',
      formulaTypelabel: '',
      formulaTypeUOM: '',
      formulaType: 'child',
    }]])
  };
  const handleRemoveAccordion = (indexToRemove) => {
    setAccordionCount(prevCount => prevCount - 1);
    setFormulas(prevFormulas => prevFormulas.filter((_, index) => index !== indexToRemove));
  };



  // Handle input change
  const handleLabelDescriptionChange = (event) => {
    setLabelDescription(event.target.value);
  };
  const handleTestNameChange = (event) => {
    setTestName(event.target.value);
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
        navigate("/home/dashboard")
        // Swal.fire('You clicked the confirm button!', '', 'success');
      }
    });
  };
  const showChildAlert = (saveval) => {
    Swal.fire({
      title: '',
      text: 'Saved Successfully.',
      icon: 'info',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`../../home/create-formula/${saveval}`)
      }
    });
  };
  
  const handleSweetAlert = (titleData, textData, iconData) => {
    if (iconData === "success") {
      Swal.fire({
        title: titleData,
        text: textData,
        icon: 'success',
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        title: titleData,
        text: textData,
        icon: 'error',
        showConfirmButton: false
      });
    }
    setTimeout(() => {
      Swal.close()
    }, 1500);
  };


  useEffect(() => {
  fetchFormulaGroups();
    console.log("params", params);
    if (params.hasOwnProperty("id")) {
      http.get(`Formulas/GetFormulaById?formulaId=${params.id}`).then((resp) => {
        console.log("GetFormulaById resp", resp.data.item2);
        setChildFormulasResp(resp.data.item2.childFormulas);
        // Update accordion count based on the number of child formulas
        setAccordionCount(resp.data.item2.childFormulas.length + 1);
        setRoundedValue(resp.data.item2.roundedUpto);
        // Update main formula and description
        setFormula(resp.data.item2.formula);
        setFormulaCode(resp.data.item2.formulaCode);
        setState((prev) => ({
          ...prev,
          descInput: resp.data.item2.formulaDispayDescription, // Update the description
        }));
        setLabelDescription(resp.data.item2.labelDescription);
        
        setTestName(resp.data.item2.testName);
        // Update variable inputs
        let prevData = [];
        resp.data.item2.formulaVariableInformation.forEach((each) => {
          let { id, variable, uom, roundsUpto, variableLabel, variableDisplayFormat } = each;
          let eachSet = { id: id, variable: variable, label: variableLabel, uom: uom, values: variableDisplayFormat, roundedUpto: roundsUpto };
          prevData.push(eachSet);
        });
        setVariableInputs(prevData);

        // Update formulas array with main formula and child formulas
        let formulasArray = [];
        let descriptionsArray = [];
        let getLabelArray = [];
        let getUOMArray = [];
        formulasArray.push(resp.data.item2.formula); // Add main formula
        descriptionsArray.push(resp.data.item2.formulaDispayDescription); // Add main formula description
        resp.data.item2.childFormulas.forEach((childFormula) => {
          // formulasArray.push(childFormula.id); // Add child id
          formulasArray.push(childFormula.formula); // Add child formulas
          descriptionsArray.push(childFormula.formulaDispayDescription); // Add child formula descriptions
        });
        resp.data.item2.formulaTypes.forEach((formulaType) => {
          getUOMArray.push(formulaType.formulaTypeUOM); // Add child formulas
          getLabelArray.push(formulaType.formulaTypelabel); // Add child formula descriptions
        });
        console.log("chil formulas arrayyyyy ", resp.data.item2.formulaTypes)
        setChildFormulaTypesObj(resp.data.item2.formulaTypes);
        setFormulas(formulasArray);
        setDescriptions(descriptionsArray); // Set descriptions array
        setFormulaTypeLabel(getLabelArray); // Set descriptions array
        setGetUOM(getUOMArray); // Set descriptions array

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

  const handleRemoveVariable = () => {
    if (variableInputs.length > 1) {
      const updatedVariables = variableInputs.slice(0, variableInputs.length - 1);
      setVariableInputs(updatedVariables);
    }
  };

  const [expression, setExpression] = useState([])

  const handleVariableInputChange = (property, value, index) => {
    const updatedVariables = [...variableInputs];
    updatedVariables[index][property] = value;
    setVariableInputs(updatedVariables);
  };



  const formulaString = variableInputs.map(input => input.label).join(' + ');

  const [state, setState] = useState({
    descInput: "",
    roundValue: 2
  })


  const [descriptions, setDescriptions] = useState(['']);
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setDescriptions(prevDescriptions => {
      const newDescriptions = [...prevDescriptions];
      newDescriptions[name] = value; // Update the description at the corresponding index
      return newDescriptions;
    });
    const objData = [...childFormulaTypesObj];
    objData[index]['formulaDispayDescription'] = value;
    setChildFormulaTypesObj(objData);
  };


  const handleFormulaLabelChange = (e, index) => {
    const { name, value } = e.target;
    setFormulaTypeLabel(prevLabels => {
      const newLabels = [...prevLabels];
      newLabels[name] = value; // Update the description at the corresponding index
      return newLabels;
    });
    const objData = [...childFormulaTypesObj];
    objData[index]['formulaTypelabel'] = value;
    setChildFormulaTypesObj(objData);
  };

  const [getUOM, setGetUOM] = useState(['']);
  const handleFormulaUOMChange = (e, index) => {
    const { name, value } = e.target;
    setGetUOM(prevGetUOM => {
      const newGetUOM = [...prevGetUOM];
      newGetUOM[name] = value;
      return newGetUOM;
    });
    const objData = [...childFormulaTypesObj];
    if (objData[index]) {

      objData[index]['formulaTypeUOM'] = value;
      setChildFormulaTypesObj(objData);
    }

  }
  // Handler function for formula type change
  const handleFormulaTypeChange = (e, index) => {
    const newFormulaTypes = [...formulaTypes];
    newFormulaTypes[index] = e.target.value;
    setFormulaTypes(newFormulaTypes);
    const objData = [...childFormulaTypesObj];
    if (objData[index]) {

      objData[index]['formulaType'] = e.target.value;
      setChildFormulaTypesObj(objData);
    }
  };


  const saveChildData = async () => {
    console.log(childFormulasResp);
    try {
        const formulasArray = [];
        const descriptionsArray = [];
        for (let i = 0; i < formulas.length; i++) {
            const formula = formulas[i];
            const variables = variableInputs.map((variableInput) => ({
                Variable: variableInput.variable,
                UOM: variableInput.uom,
                VariableLabel: variableInput.label,
                id: variableInput.id,
            }));

            const formulaObj = {
                Formula: formula,
                formulaVariableInformation: variables,
            };

            formulasArray.push(formulaObj);
        }
        descriptionsArray.push(...descriptions);
        console.log("............", formulasArray);

        const obj = {
            Id: params.id,
            formulaCode: formulaCode,
            Groupvalue: selectedGroup,
            labelDescription: labelDescription,
            TestName:TestName,
            
            roundedUpto: roundedValue,
            FormulaDispayDescription: descriptionsArray[0],
            Formula: formulasArray[0].Formula,
            
            FormulaType: formulaTypes[0],
            formulaVariableInformation: formulasArray[0].formulaVariableInformation,
            ChildFormulas: formulasArray.slice(1).map((formula, index) => ({
                id: childFormulasResp?.[index]?.id ?? 0, // Include the child formula id or default to 0
                FormulaDispayDescription: descriptionsArray[index + 1],
                Formula: formula.Formula,
              
                formulaVariableInformation: formula.formulaVariableInformation,
            })),
            formulaTypes: childFormulaTypesObj,
        };

      console.log("obj", obj);
      // const resp = await axios.post("http://localhost:58747/api/Formulas/SaveFormulaData", obj);
      const resp = await axios.post("http://172.26.8.225:8086/api/Formulas/SaveFormulaData", obj); 
      console.log("resp", resp.data.item2);
      setSaveDataId(resp.data.item2);
      showChildAlert(resp.data.item2);
      // console.log("params.id:", params.id);
      // if(params.id==null){
      // params.id=resp.data.item2.formulasaveId;
      // console.log("params.id:", params.id);
    
    } catch (err) {
      console.log("err", err);
      // Handle errors here
    }
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const validateComments = () => {
    return comments.trim() !== '';
  };
  

  const showChildAlert1 = () => {
    Swal.fire({
      title: 'Authentication Required',
      html: `
        <input type="text" id="username" class="swal2-input" placeholder="Username" style="padding: 2px;width: 75%; font-size: 11px;">
        <input type="password" id="password" class="swal2-input" placeholder="Password" style="padding: 2px;width: 75%; font-size: 11px;">
        <textarea id="swal-comments" class="swal2-input" placeholder="Comments" style="padding: 3px;
        width: 75%;
        margin-top: 6px;
        font-size: 10px;
        height: 60px;"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username').value;
        const password = Swal.getPopup().querySelector('#password').value;
        const swalComments = Swal.getPopup().querySelector('#swal-comments').value;
        if (!username || !password) {
          Swal.showValidationMessage(`Please enter username and password`);
        }
        else if(swalComments===""){
          Swal.showValidationMessage(`Please Add Comments `);

        }
        
        return { username, password, swalComments };
      },
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, password, swalComments } = result.value;
        if (username === 'User007' && password === '1234') {
          // Pass the comments from the Swal input
          saveData(swalComments);
          showAlert();
        } else {
          Swal.fire('Authentication failed', 'Invalid username or password', 'error');
        }
      }
    });
  };

  const handleEditClick = () => {
    if (!validateComments()) {
      Swal.fire('Validation Error', 'Please add comments', 'error');
      return;
    }
    showChildAlert1();
  };

  const saveData = async (swalComments) => {
    console.log(childFormulasResp);
    try {
      showChildAlert1();
      const formulasArray = [];
      const descriptionsArray = [];
      const formulaTypeArray = [];

      for (let i = 0; i < formulas.length; i++) {
        const formula = formulas[i];
        const variables = variableInputs.map((variableInput) => ({
          Variable: variableInput.variable,
          UOM: variableInput.uom,
          VariableDisplayFormat: variableInput.values,
          VariableLabel: variableInput.label,
          id: variableInput.id,
        }));

        const formulaObj = {
          Formula: formula,
          formulaVariableInformation: variables,
        };

        formulasArray.push(formulaObj);
      }
      descriptionsArray.push(...descriptions);
      console.log("............", formulasArray);

      const obj = {
        Id: params.id,
        formulaCode: formulaCode,
        Groupvalue: selectedGroup,
        labelDescription: labelDescription,
        TestName: TestName,
        reference: reference,
        comments:swalComments,
        roundedUpto: roundedValue,
        FormulaDispayDescription: descriptionsArray[0],
        Formula: formulasArray[0].Formula,
        RoundedValue: responseData.item2.toFixed(roundedValue),
        RawValue: JSON.stringify(formulaResponseArray[0].val),
        FormulaType: formulaTypes[0],
        formulaVariableInformation: formulasArray[0].formulaVariableInformation,
        ChildFormulas: formulasArray.slice(1).map((formula, index) => ({
          id: childFormulasResp?.[index]?.id ?? 0, // Include the child formula id or default to 0
          FormulaDispayDescription: descriptionsArray[index + 1],
          Formula: formula.Formula,
          RawValue: JSON.stringify(formulaResponseArray[index + 1].val),
          formulaVariableInformation: formula.formulaVariableInformation,
        })),
        formulaTypes: childFormulaTypesObj,
      };

      console.log("obj", obj);
      const resp = await axios.post("http://172.26.8.225:8086/api/Formulas/CreateorUpdateFormula", obj);
    //  const resp = await axios.post("http://localhost:58747/api/Formulas/CreateorUpdateFormula", obj); 
      console.log("resp", resp.data);
      // showChildAlert1();
    } catch (err) {
      console.log("err", err);
      // Handle errors here
    }
  };
 



const handleValidation = () => {
  setIsLoading(true);
  setError(null);
  let arr;

  let allChildValues = [...variableInputs];
  let valueMap = {};
  let expressions = [];

  formulas.forEach((val, key) => {
    allChildValues.forEach(item => {
      valueMap[item.label] = item.values;
    });
    Object.keys(valueMap).forEach(label => {
      let regex = new RegExp('\\b' + label + '\\b', 'g');
      [val] = [val].map(x => x.replace(regex, valueMap[label]));
    });
    allChildValues.push({
      "variable": "var",
      "label": getLabel[key],
      "uom": "mg",
      "displayFormat": "",
      "roundedUpTo": "",
      "values": val
    });
    console.log(val);
    expressions.push(val);
  });

  setExpression(expressions);

  const context = {
    Avg,
    Max,
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
      setformulaResponseArray((preData) => [...preData, obj]);
      setResponseData({ item2: innerExpressionResult });
      return innerExpressionResult;
    } catch (error) {
      console.error(`Error evaluating expression ${index + 1}:`, error);
      return null;
    }
  });
  console.log(results);
};
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

function STDEV(...values) {
  const count = values.length;
  const mean = Avg(...values);
  const squareDiffs = values.map(value => (value - mean) ** 2);
  const sumSquareDiff = Sum(squareDiffs);
  const countSumSquareDiff = sumSquareDiff / (count - 1);
  const sqrtCountSumSquareDiff = Math.sqrt(countSumSquareDiff);
  return sqrtCountSumSquareDiff;
}

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
  console.log(mean)
  const standardDeviation = STDEV(...values);
  console.log(standardDeviation)
  return (standardDeviation / mean) * 100;
}

function ROUND(value, decimals) {
  if (isNaN(value)) {
    console.warn(`Warning: Attempting to round NaN value`);
    return 0;
  }
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

  const handleValidationApi = (val, index, name) => {
    console.log(val)
    // console.log(eval(val.replace(/Max/g, "Math.max")));
    setformulaResponseArray([])
    const apiUrl = `http://172.26.8.225:8086/api/Formulas/FormulaValidation?expression=${encodeURIComponent(val)}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {

            // Assuming responseData.item2 contains raw value data
            const rawData = data.item2; // Access raw value data from the API response
            let obj = { val: rawData }
            // console.log(index);
            console.log(" --obj --" + rawData);
            setformulaResponseArray((preData => {
                return [...preData, obj]
            }));
            // if (index == 0) {
            //     selectedItem.rawValue = rawData;
            // }
            // selectedItem.childFormulas[index - 1].rawValue = rawData;
            // console.log(a);
            // console.log(selectedItem.childFormulas)

        })
        .catch(error => {
        });

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
    // console.log(formulaResponse); 
    console.log(formulaResponseArray)
  }, [formulaResponse, responseData]);

  const [uomOptions, setUomOptions] = useState([]);

  useEffect(() => {
      // Fetch UOM options from the API
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

      fetchUOMs();
  }, []);

  return (
    <>
      {currentView === 1 && (
        <>
          <section className="full_screen">
            <ul className="inner">
              <li className="" style={{ width: "100%" }}>
                {/* <nav aria-label="breadcrumb" className="mainBreadcrumb">
                <div className="position-relative">
                  <ol className="breadcrumb" style={{ fontSize: "13px" }}>
                    <li className="breadcrumb-item"><Link to={"/home/dashboard"}>Dashboard</Link></li>
                    <li className="breadcrumb-item">Create</li>
                  </ol>
                </div>
              </nav> */}

                <div style={{ background: "#fff", padding: "2rem 2rem 0rem" }}>

                  <Row>
                    <Col sm={5}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Formula Description</p>
                      <input
                        placeholder='Enter Description'
                        className='formulaName'
                        value={labelDescription}
                        onChange={handleLabelDescriptionChange}
                      />
                    </Col>
                    <Col sm={3}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Test Name</p>
                      <input
                        placeholder='Enter Test Name'
                        className='formulaName'
                        value={TestName}
                        onChange={handleTestNameChange}
                      />
                    </Col>
                    <Col sm={3}>
                      <p style={{ backgroundColor: "#fff", color: "#000", fontWeight: "600" }}>Select Group Name</p>

                      <select className="groupByName1" onChange={(e) => setSelectedGroup(e.target.value)}>
                        <option value="" disabled selected>Select Group Name</option>
                        {formulaGroups.map(group => (
                          <option key={group.id} value={group.configureValue}>
                            {group.configureValue}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>

                  <table className="mainTable " >
                    <thead>
                      <tr>
                        {/* <th width="40"></th> */}
                        <th width="60" className="">S. No.</th>
                        <th     width='500px'>Input Variables</th>
                        <th>Label</th>
                        <th>UOM</th>
                        <th width="200"></th>
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
                                value={variable.label}
                                className='variablesInput'
                                onChange={(e) => {
                                  const userInput = e.target.value;
                                  const updatedVariables = [...variableInputs];
                                  updatedVariables[index].label = e.target.value.trim();
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
                                    updatedVariables[index].uom = e.target.value;
                                    setVariableInputs(updatedVariables);
                                }}
                            >
                                 <option value="">Select UOM</option>
                                {uomOptions.map(uom => (
                                    <option key={uom.id} value={uom.name}>{uom.name}</option>
                                ))}
                            </select>
                        </td>

                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                  <button className='me-2' onClick={handleAddVariable}>
                    <CiCirclePlus className='circlePlus' />
                  </button>
                  <button className='me-2' style={{ marginLeft: '1px' }} onClick={handleRemoveVariable}>
                    <CiCircleMinus className='circlePlus' />
                  </button>


                  {/* {console.log("formulas-new: ", formulas)} */}
                  {

[...Array(accordionCount)].map((_, index) => (

  <div key={index}>

    <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <table className="mainTable" style={{ fontSize: "12px" }} disabled>
            <thead>
              <tr>
                <th>Description</th>
                <th>Type of Formula</th>
                
                    <th>Label</th>
                   
              <th>UOM</th>
                <th></th>
                <th width="200"></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="ui-sortable-handle" onClick={(e) => { e.stopPropagation(); }}>
                <td style={{ width: "500px" }}>
                  <input type="text" placeholder="Description" className="  descInput " name={index} value={descriptions[index]} onChange={(e) => handleChange(e, index)} rows={1} />
                </td>
                <td style={{ width: "300px" }}>
                  <select name="formula" id="formulaType" onChange={(e) => handleFormulaTypeChange(e, index)}>
                    <option value="child">Child</option>
                    <option value="final">Final</option>
                  </select>
                </td>
                
                    <td style={{ width: "100px" }}>
                      {/* <input placeholder='Enter Label' value={getLabel[index]} name={index} type="text" onChange={(text) => { console.log(text) }} /> */}
                      <input placeholder='Enter Label' value={getLabel[index]} type="text" name={index} onChange={(e) => handleFormulaLabelChange(e, index)} 
                      disabled={formulaTypes[index] === 'final'}
                      />
                    </td>
                    
                   
                <td>
                      <select
                        value={getUOM[index]}
                        name={index}
                        onChange={(e) => handleFormulaUOMChange(e, index)}
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
            <span className="symbol" onClick={() => handleButtonClick(0, '+')}><FaPlus /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '-')}><FaMinus /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '*')}><FaStarOfLife /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '/')}><FaDivide /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '%')}><FaPercentage /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '<')}><FaLessThan /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '>')}><FaGreaterThan /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '≤')}><FaLessThanEqual /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '≥')}><FaGreaterThanEqual /></span>
            <span className="symbol" onClick={() => handleButtonClick(0, '( )')}><PiBracketsRoundBold /></span>
            <div className="formulaMain">
              <span>fx</span>
              <FunctionDropdown className="DropdownFunctions" handleButtonClick={handleButtonClick} index={0} />
            </div>
          </div>
          <textarea
                                className='formulaEdit'
                                rows={3}
                                value={formulas[index]}
                                onChange={(e) => {
                                  handleFormulaChange(index, e.target.value);
                                  setRawFormula((prev) => [...prev, e.target.value]);
                                }}
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
                          onClick={handleAddAccordion} // Call the function to add accordion
                        >
                          Add Formula
                        </button>
                      </div>
                    </div>
                  </div>




                  <h5 className='description '> Round upto:</h5>
                  <input type='number' className='descInput mb-3' value={roundedValue} placeholder="" name='roundValue' min={0} style={{ width: "20%" }} onChange={(e) => { setRoundedValue(e.target.value) }} />


                  <div className="py-1">
                    <div className="row" style={{  paddingRight: "25px" }}>
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
                      <button class="btn btn-primary" onClick={saveChildData} style={{marginRight:'10px'}} >Save</button>
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
      )}

      {currentView === 2 && (
        <>
          <section class="full_screen">
            <ul class="inner">
              <li class="leftSide">
                <Col sm={12}>
                  <Row>
                    <Col>
                      <p className='dashboardCreate'><Link to={"/home/dashboard"}>Dashboard</Link><span style={{ cursor: 'pointer' }} className={currentView === 1 ? 'active' : ''}
                        onClick={() => showView(1)}> / Create</span><span style={{ color: "#707070" }}> / Validate</span> </p>
                    </Col>
                  </Row>



                  <Row className='fulBodyValidate'>
                    <Col>
                      {variableInputs.map((variable, index) => (
                        <VariableInputRow
                          key={index}
                          index={index}
                          variable={variable.variable}
                          label={variable.label}
                          values={variable.values}
                          uom={variable.uom}
                          displayFormat={variable.displayFormat}
                          // roundedUpTo={variable.roundedUpTo}
                          onChange={handleVariableInputChange}
                        />
                      ))}
                    </Col>
                  </Row>
                  <Row className='fulBodyValidate'>
                    <Col className='createData' sm={12}>

                    </Col>
                  </Row>
                  <Row className='fulBodyValidate'>
                    <Col className='createData' sm={12}>
                      <h5 className='description'> Reference:</h5>

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
                    {formulas.map((formula, index) => (
                      <><div key={index}>
                        <p>
                          Formula {index + 1}: {formula} <br />
                          Expression{index + 1}={(expression[index] || "")}
                        </p>
                      </div>
                        <div>
                          {formulaResponseArray?.length ?
                            <div>
                              <p>Raw Value: {formulaResponseArray?.[index]?.val}</p>
                              <p>Rounded Value: {formulaResponseArray?.[index]?.val.toFixed(roundedValue)}</p>
                            </div>

                            : null
                          }
                        </div>
                      </>
                    ))}

                    {/* for validate button edit start */}
                    {!responseData && (
                      <button onClick={handleValidation} >
                        Validate Formula
                      </button>
                    )}
                    {/* for validate button edit end */}

                  </div>
                  <hr />
                  <div class="py-1">
                    <div class="row">
                      <div class="col">
                        <button
                          className={currentView === 1 ? ' btn btn-primary' : 'btn btn-primary'}
                          onClick={() => { showView(1); setResponseData(null); setformulaResponseArray([]) }}                      >
                          Back
                        </button>
                      </div>
                      <div class="col text-end">

                        <button class="btn btn-primary" onClick={saveData} style={{fontSize:'80%'}} >Send For Approval</button>
                      </div>
                    </div>
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


export default CreateFormula;
