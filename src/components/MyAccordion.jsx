import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Accordion } from 'react-bootstrap';
import { FaPlus, FaMinus, FaStarOfLife, FaDivide, FaPercentage, FaLessThan, FaGreaterThan, FaLessThanEqual, FaGreaterThanEqual } from "react-icons/fa";
import { PiBracketsRoundBold } from "react-icons/pi";
import FunctionDropdown from './Dropdown';
import './MyAccordion.css';
import http from './Http';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const MyAccordion = () => {
  const [currentView, setCurrentView] = useState(1);
  const [variableInputs, setVariableInputs] = useState([
    { id: 1, variable: '', label: '', uom: '', displayFormat: '', roundedUpTo: '', values: [] },
  ]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedValidateFunction, setSelectedValidateFunction] = useState('');
  const [formula, setFormula] = useState('');
  const [rawFormula, setRawFormula] = useState([]);
  const [rawValue, setRawValue] = useState('');
  const [roundedValue, setRoundedValue] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [descInput, setDescInput] = useState("")
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
        navigate("/dashboard")
        // Swal.fire('You clicked the confirm button!', '', 'success');
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
    console.log("params", params)
    if (params.hasOwnProperty("id")) {
      http.get(`/GetFormulaById?formulaId=${params.id}`).then((resp) => {
        console.log("GetFormulaById resp", resp.data)
        setState((prev) => {
          return {
            ...prev,
            descInput: resp.data.item2.formulaDispayDescription
          }
        })

        let prevData = []
        resp.data.item2.formulaVariableInformation.forEach((each) => {
          let { id, variable, uom, roundsUpto, variableLabel, variableDisplayFormat } = each;
          let eachSet = { id: id, variable: variable, label: variableLabel, uom: uom, displayFormat: variableDisplayFormat, roundedUpTo: roundsUpto, values: [] }
          prevData.push(eachSet)
          

        })

        setVariableInputs(prevData)
        setFormula(resp.data.item2.formula)

      }).catch((err) => {
        console.log("error", err)
      })
    }

  }, [])

  const handleButtonClick = (text) => {
    setFormula(prevFormula => prevFormula + text);
    setRawFormula((prev) => {
      return [...prev, text]
    })
  };

  const showView = (viewNumber) => {
    setCurrentView(viewNumber);
  };

   

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

  const [expression, setExpression] = useState("")

  const handleVariableInputChange = (property, value, index) => {
    const updatedVariables = [...variableInputs];
    updatedVariables[index][property] = value;
    setVariableInputs(updatedVariables);
    let e = formula
    let valueMap = {};
    updatedVariables.forEach(item => {
      valueMap[item.label] = item.values;
    });
    Object.keys(valueMap).forEach(label => {
      let regex = new RegExp('\\b' + label + '\\b', 'g');
      e = e.replace(regex, valueMap[label]);
    });
    setExpression(e)
  };

  

  const formulaString = variableInputs.map(input => input.label).join(' + ');

  const [state, setState] = useState({
    descInput: "",
    roundValue: 2
  })

  const handleChange = (e) => {
    let { name, value } = e;
    setState((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const saveData = () => {
    let payload = {
      formulaDispayDescription: state.descInput,
      formula: formula,
      formulaVariableInformation: variableInputs
    }

    http.post("/CreateorUpdateFormula", payload).then((resp) => {
      console.log("resp", resp.data)
      showAlert();
    }).catch((err) => {
      console.log("err", err)
    })
  }


  return (
    
    
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <input
            placeholder="Description"
            className="form-control descInput textarea-no-outline"
            name='descInput'
            // value={state.descInput}
            onChange={handleChange}
            rows={1}
          />
        </Accordion.Header>
        <Accordion.Body>
          <div className="symbMain">
          <span className="symbol" onClick={() => handleButtonClick('+')}><FaPlus /></span>
            <span className="symbol" onClick={() => handleButtonClick('-')}><FaMinus /></span>
            <span className="symbol" onClick={() => handleButtonClick('*')}><FaStarOfLife /></span>
            <span className="symbol" onClick={() => handleButtonClick('/')}><FaDivide /></span>
            <span className="symbol" onClick={() => handleButtonClick('%')}><FaPercentage /></span>
            <span className="symbol" onClick={() => handleButtonClick('<')}><FaLessThan /></span>
            <span className="symbol" onClick={() => handleButtonClick('>')}><FaGreaterThan /></span>
            <span className="symbol" onClick={() => handleButtonClick('≤')}><FaLessThanEqual /></span>
            <span className="symbol" onClick={() => handleButtonClick('≥')}><FaGreaterThanEqual /></span>
            <span className="symbol" onClick={() => handleButtonClick('( )')}><PiBracketsRoundBold /></span>
            <div className="formulaMain">
              <span>fx</span>
              <FunctionDropdown className="DropdownFunctions" handleButtonClick={handleButtonClick} />
            </div>
          </div>
          
          <textarea
            className='formulaEdit'
            rows={11}
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          ></textarea>
        </Accordion.Body>
      </Accordion.Item>
      {/* <button className="btn btn-primary" onClick={saveData}>Save</button> */}
    </Accordion>
  );
};

export default MyAccordion;
