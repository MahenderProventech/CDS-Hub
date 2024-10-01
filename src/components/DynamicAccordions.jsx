import React, { useState } from 'react';
import './Dashboard.css';
import { Accordion } from 'react-bootstrap';
import { FaPlus, FaMinus, FaStarOfLife, FaDivide, FaPercentage, FaLessThan, FaGreaterThan, FaLessThanEqual, FaGreaterThanEqual } from "react-icons/fa";
import { PiBracketsRoundBold } from "react-icons/pi";
import FunctionDropdown from './Dropdown';
import http from './Http'; // Assuming Http utility is defined in './Http'
import MyAccordion from './MyAccordion'; // Import the MyAccordion component

import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateFormula = () => {
  const [accordionCount, setAccordionCount] = useState(1);

  // Function to handle adding a new accordion
  const handleAddAccordion = () => {
    setAccordionCount(prevCount => prevCount + 1);
    
  };
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
  
  const navigate = useNavigate();
  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Formula ID Is Created Successfully.',

      icon: 'info',
      confirmButtonText: 'Ok',
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

    http.post("CreateorUpdateFormula", payload).then((resp) => {
      console.log("resp", resp.data)
      showAlert();
    }).catch((err) => {
      console.log("err", err)
    })
  }

  return (
    <div>
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
      <hr />

      <div style={{ padding: "0 2rem" }}>
        {/* Render accordions based on the accordion count */}
        {[...Array(accordionCount)].map((_, index) => (
          <div key={index}>
            <MyAccordion />
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateFormula;
