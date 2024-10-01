import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from './Http';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

// import Calculator from './Calculator';
const GenerateResultsById = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState('');
    const [testName, setTestName] = useState('');
    const [formulasCol, setFormulasCol] = useState([]);
    const [formulaInputs, setformulaVariableInformation] = useState(null);
    const [formulaResponseArray, setformulaResponseArray] = useState([]);
    const [expressions, setExpression] = useState([]);
    const [roundedUpTo, setRoundedUpto] = useState('');
    const [errors, setErrors] = useState({
        formulaInputsError: '',
        productNameError: '',
        batchNumberError: '',
        projectNameError: '',
        projectIdError: ''
    });


    useEffect(() => {
        if (selectedItem) {
            setTestName(selectedItem.testName || '');
        }
    }, [selectedItem]);

    const handleTestNameChange = (e) => {
        const newTestName = e.target.value;
        setTestName(newTestName);

        // Update the selectedItem with the new testName
        setSelectedItem(prevItem => ({
            ...prevItem,
            testName: newTestName
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get(`Formulas/GetFormulaDetailsByGroupName?groupvalue=${id}`);
                console.log('Fetched Data:', response.data.item2);

                // console.log(response.data.item2[0].formulaVariableInformation)
                if (response.data && Array.isArray(response.data.item2)) {
                    setData(response.data.item2);

                } else {
                    console.error('Unexpected data format', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const [childFormulaTypesObj, setChildFormulaTypesObj] = useState([]);
    const handleSelectChange = (event) => {
        // console.log(event);
        const selectedId = parseInt(event.target.value, 10);
        const selectedItem = data.find(item => item.id === selectedId);
        setSelectedId(selectedId);
        setSelectedItem(selectedItem);
        setRoundedUpto(selectedItem.roundedUpto)
        setChildFormulaTypesObj(selectedItem.childFormulas);
        selectedItem.formulaVariableInformation.forEach(item => {
            item.variableDisplayFormat = ""; // Set variableDisplayFormat to empty string
        })
        console.log(selectedItem.formulaVariableInformation)
        setformulaVariableInformation(selectedItem.formulaVariableInformation)
    };

    const { userData } = React.useContext(UserContext);



    const showChildAlert1 = () => {
        if (!productName || !batchNumber || !projectId || !projectName) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                projectNameError: 'Please Enter All Details'
            }));
            return; // Prevent showing the authentication prompt if validation fails
        }
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
                    console.log(payload)

                    http.post("Login/AuthenticateData", payload)
                        .then((resp) => {
                            if (resp.data.item1) {
                                updateSaveData(swalComments);
                                showAlert();
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

    const handleProjectName = (event) => {
        setProjectName(event.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            projectNameError: ''
        }));
    };

    //   const { userData } = React.useContext(UserContext);

    const updateSaveData = async (swalComments) => {
        if (!selectedItem) return; // Ensure selectedItem is defined


        const updatedSelectedItem = {
            ...selectedItem,
            comments: swalComments,
            productName: productName,
            projectName: projectName,
            projectId: projectId,
            batchId: batchNumber,
            executionChildFormula: selectedItem.childFormulas,
            executionFormulaVariableInfo: selectedItem.formulaVariableInformation
        };
        delete updatedSelectedItem.childFormulas;
        delete updatedSelectedItem.formulaVariableInformation;
        delete updatedSelectedItem.formulaTypes;
        console.log(updatedSelectedItem)
        // Send data to the server or perform your desired operation
        try {
            console.log("obj:", updatedSelectedItem);
            const response = await http.post('ExecutionFormula/CreateorUpdateExecuitonFormula', updatedSelectedItem);
            console.log('Server response:', response.data);
            // showAlert();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };




    const showAlert = () => {
        Swal.fire({
            title: '',
            text: 'Formula Successfully Updated.',
            icon: 'info',
            confirmButtonText: 'Ok',
            cancelButtonText: 'Close',
            showCancelButton: true,
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/home/execReviewDashboard");
            }
        });
    };

    const handleValidation = () => {
        // Check if all inputs are filled
        const areAllInputsFilled = formulaInputs.every(input => input.variableDisplayFormat && input.variableDisplayFormat.trim() !== '');

        if (!areAllInputsFilled) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                formulaInputsError: 'Please Enter All Values'
            }));
            return; // Exit the function if validation fails
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            formulaInputsError: ''
        }));

        console.log(formulaInputs);
        console.log(childFormulaTypesObj);

        const resultArray = childFormulaTypesObj.map(item => replaceVariables(item.formula, formulaInputs, childFormulaTypesObj));
        console.log(resultArray);

        if (resultArray) {
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
                Math
            };
            let innerExpressionResult;
            const results = resultArray.map((expression, index) => {
                console.log(expression);
                try {
                    innerExpressionResult = new Function(...Object.keys(context), `return (${expression})`)(...Object.values(context));
                    console.log("innerExpressionResult ", innerExpressionResult);
                    if (isNaN(innerExpressionResult) || innerExpressionResult === undefined || innerExpressionResult === null) {
                        throw new Error(`Expression '${expression}' returned an invalid result: ${innerExpressionResult}`);
                    }
                    selectedItem.childFormulas[index].rawValue = innerExpressionResult;
                    selectedItem.childFormulas[index].roundedValue = parseFloat(innerExpressionResult).toFixed(2);
                    setChildFormulaTypesObj((prev) => {
                        let updatedVals = prev;
                        updatedVals[index]['rawValue'] = JSON.stringify(innerExpressionResult);
                        updatedVals[index]['roundedValue'] = innerExpressionResult.toFixed(roundedUpTo);
                        return updatedVals;
                    });
                    return { val: innerExpressionResult, roundedVal: parseFloat(innerExpressionResult).toFixed(2) };
                } catch (error) {
                    console.error(`Error evaluating expression '${expression}':`, error);
                    innerExpressionResult = null; // Handle the error by setting innerExpressionResult to null or another fallback value
                }
            });
            console.log(results);
            setformulaResponseArray(results);
        }
    };


    // Function to replace variables in formulas with their values from array1
    function replaceVariables(formula, variables, formulas) {
        // Use a regular expression with word boundary to ensure exact matches
        return formula.replace(/\b([A-Z]+\d*)\b/g, match => {
            const variableObj = variables.find(v => v.variableLabel === match);
            if (variableObj) {
                return variableObj.variableDisplayFormat;
            } else {
                // Check if match corresponds to formulaTypelabel in array2
                const formulaObj = formulas.find(f => f.formulaTypelabel === match);
                if (formulaObj) {
                    return replaceVariables(formulaObj.formula, variables, formulas);
                }
            }
            return match; // if no matching variable or formula found, return the original match
        });
    }

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



    const updateInputVariables = (e, index) => {
        const { name, value } = e.target;
        const objData = [...formulaInputs];
        objData[index][name] = value;
        setformulaVariableInformation(objData);
        selectedItem.formulaVariableInformation = objData;
        setErrors((prevErrors) => ({
            ...prevErrors,
            formulaInputsError: ''
        }));
    }



    return (
        <section className="pb-5 full_screen">
            <nav aria-label="breadcrumb" className="mainBreadcrumb">
                <div className="position-relative">
                    <ol className="breadcrumb" style={{ padding: '0px', background: 'none' }}>
                        <li className="breadcrumb-item" style={{ color: 'black' }}>Execution / Batch Results / {id}</li>
                    </ol>
                    <div className="btnSet">
                        <Link className="btn btn-primary me-2" to={"/home/batchresult"}>Back</Link>
                    </div>
                </div>
            </nav>
            <div style={{ paddingLeft: "50px", marginTop: '30px' }}>
                {data ? (
                    <>
                        <Row>
                            <Col sm={3}>
                                <p className='generateIdNames'>Product Name/Code  <span style={{ color: 'red' }}>*</span></p>
                                <input
                                    className="formulaName mt-2"
                                    placeholder='Enter Product Name/Code'
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </Col>
                            <Col sm={3}>
                                <p className='generateIdNames'>Batch Number  <span style={{ color: 'red' }}>*</span></p>
                                <input
                                    className="formulaName mt-2"
                                    placeholder='Enter Batch ID'
                                    value={batchNumber}
                                    onChange={(e) => setBatchNumber(e.target.value)}
                                />
                            </Col>
                            <Col sm={3}>
                                <p className='generateIdNames'>Group Name </p>
                                <input
                                    className="formulaName mt-2"
                                    placeholder='Enter Batch ID'
                                    value={id}
                                    disabled
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <p className='generateIdNames mt-2'>Project Name</p>
                                <input
                                    className="formulaName mt-1"
                                    placeholder='Enter Project Name'
                                    value={projectName}
                                    // onChange={(e) => setProjectName(e.target.value)}
                                    onChange={handleProjectName}



                                />

                            </Col>
                            <Col sm={3}>
                                <p className='generateIdNames mt-2'>Project Id</p>
                                <input
                                    className="formulaName mt-1"
                                    placeholder='Enter Project ID'
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}

                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <p className='generateIdNames mt-3'>Select Formula Description  <span style={{ color: 'red' }}>*</span></p>
                                <select onChange={handleSelectChange} className="formulaName mt-2">
                                    <option value="" disabled selected>Select Formula Description</option>
                                    {data.map((item) => (
                                        <option key={item.id} value={item.id}>{item.labelDescription}</option>
                                    ))}
                                </select>
                            </Col>
                            {selectedItem && (
                                <Col sm={3}>
                                    <p className='generateIdNames mt-3'>Test Name</p>
                                    <input
                                        className="formulaName mt-2"
                                        placeholder='Enter Test Name'
                                        value={testName}
                                        onChange={handleTestNameChange}
                                    />
                                </Col>
                            )}
                            {selectedItem && (
                                <div >
                                    <Row >
                                        <Col sm={1}>
                                            <p className='generateIdNames mt-3' style={{ fontSize: '11px' }}>S.No</p>
                                            {selectedItem.formulaVariableInformation.map((variable, index) => (
                                                <div key={index}>
                                                    <input
                                                        className="variableInput mt-2"
                                                        value={index + 1}
                                                        readOnly
                                                        style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                        disabled
                                                    /><br />
                                                </div>
                                            ))}
                                        </Col>
                                        <Col sm={4}>
                                            <p className='generateIdNames mt-3' style={{ fontSize: '11px' }}>Variable Inputs</p>
                                            {selectedItem.formulaVariableInformation.map((variable, index) => (
                                                <input
                                                    key={index}
                                                    className="variableInput mt-2"
                                                    placeholder={variable.variable}
                                                    value={variable.variable}
                                                    readOnly
                                                    style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                    disabled
                                                />
                                            ))}
                                        </Col>
                                        <Col sm={1}>
                                            <p className='generateIdNames mt-3' style={{ fontSize: '11px' }}>Label Inputs</p>
                                            {selectedItem.formulaVariableInformation.map((variable, index) => (
                                                <input
                                                    key={index}
                                                    className="variableInput mt-2"
                                                    placeholder={variable.variableLabel}
                                                    value={variable.variableLabel}
                                                    readOnly
                                                    disabled
                                                    style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                />
                                            ))}
                                        </Col>
                                        <Col sm={2}>
                                            <p className='generateIdNames mt-3' style={{ fontSize: '11px' }}>Values  <span style={{ color: 'red' }}>*</span></p>
                                            {selectedItem.formulaVariableInformation.map((variable, index) => (
                                                <div key={index}>
                                                    <input
                                                        className="variableInput mt-2"
                                                        placeholder=""
                                                        // defaultValue={""}
                                                        name="variableDisplayFormat"
                                                        onChange={(e) => updateInputVariables(e, index)}
                                                        style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                    /><br />
                                                </div>
                                            ))}
                                        </Col>
                                        <Col sm={1}>
                                            <p className='generateIdNames mt-3' style={{ fontSize: '11px' }}>UOM</p>
                                            {selectedItem.formulaVariableInformation.map((variable, index) => (
                                                <input
                                                    key={index}
                                                    className="variableInput mt-2"
                                                    placeholder={variable.uom}
                                                    value={variable.uom}
                                                    readOnly
                                                    disabled
                                                    style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                />
                                            ))}
                                        </Col>
                                    </Row>
                                    {selectedItem.childFormulas.map((i, index) => (

                                        <Row>
                                            <Col sm={1}>
                                                <p className='generateIdNames mt-3'>S.No</p>
                                                <div key={index}>
                                                    <input
                                                        className="variableInput mt-2"
                                                        value={index + 1}
                                                        readOnly
                                                        style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                        disabled /><br />
                                                </div>

                                            </Col>
                                            <Col sm={4}>
                                                <p className='generateIdNames mt-3'>Child Formulas Description</p>
                                                <div key={index}>
                                                    <input
                                                        className="variableInput mt-2"
                                                        placeholder={i.formulaDispayDescription}
                                                        defaultValue={i.formulaDispayDescription}
                                                        style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                        disabled /><br />
                                                </div>
                                            </Col>
                                            <Col sm={2}>
                                                <p className='generateIdNames mt-3'>Child Formulas Labels</p>
                                                <div key={index}>
                                                    <input
                                                        className="variableInput mt-2"
                                                        placeholder={i.formulaTypelabel}
                                                        defaultValue={i.formulaTypelabel}
                                                        style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                        disabled /><br />
                                                </div>
                                            </Col>
                                            <Col sm={2}>
                                                <p className='generateIdNames mt-3'>Child Formulas UOM</p>
                                                <div key={index}>
                                                    <input
                                                        className="variableInput mt-2"
                                                        placeholder={i.formulaTypeUOM}
                                                        defaultValue={i.formulaTypeUOM}
                                                        style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                        disabled /><br />
                                                </div>
                                            </Col>
                                            <Col sm={2}>
                                                <p className='generateIdNames mt-3'>Child Formulas</p>
                                                {/* {formulasCol?.map((formula, index) => ( */}
                                                <div key={index}>
                                                    <input
                                                        className="variableInput mt-2"
                                                        // placeholder={i.formulaTypeUOM}
                                                        defaultValue={i.formula}
                                                        style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                        disabled /><br />
                                                </div>
                                                {/* ))} */}
                                            </Col>

                                        </Row>
                                    ))}



                                    <Col sm={7} className='p-0'>
                                        <button onClick={handleValidation} className='btn btn-primary mt-4 '>
                                            Calculate
                                        </button>
                                        <Form.Text className="text-danger">{errors.formulaInputsError}</Form.Text>
                                    </Col>
                                    {/* <Calculator formulas={formulas} CalculateFunction={handleCalculation} /> */}
                                    <Row>
                                        <table className="mainTable mt-3">
                                            <thead>
                                                <tr >
                                                    <th style={{ fontSize: '12px' }} width="60">S. No.</th>
                                                    <th style={{ fontSize: '12px' }}>Description</th>
                                                    <th style={{ fontSize: '12px' }} width="100">Type</th>
                                                    <th style={{ fontSize: '12px' }} width="100">Label</th>
                                                    <th style={{ fontSize: '12px' }} width="150">Raw Value</th>
                                                    <th style={{ fontSize: '12px' }} width="150">Rounded Value</th>
                                                    <th style={{ fontSize: '12px' }} width="100">UOM</th>
                                                    <th style={{ fontSize: '12px' }}>Formula Used</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedItem.childFormulas.map((variable, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="variableInput mt-2"
                                                                value={index + 1}
                                                                readOnly
                                                                style={{ width: "65%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                disabled
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="variableInput mt-2"
                                                                placeholder={variable.formulaDispayDescription}
                                                                defaultValue={variable.formulaDispayDescription}
                                                                style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                disabled
                                                            />
                                                        </td>
                                                        <td>
                                                            {variable.formulaType !== null ? (
                                                                <input
                                                                    className="variableInput mt-2"
                                                                    placeholder={variable.formulaType}
                                                                    defaultValue={variable.formulaType}
                                                                    style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                    disabled
                                                                />
                                                            ) : (
                                                                <input
                                                                    value={"child"}
                                                                    className="variableInput mt-2"
                                                                    style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                />
                                                            )}
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="variableInput mt-2"
                                                                placeholder={variable.formulaTypelabel}
                                                                defaultValue={variable.formulaTypelabel}
                                                                style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                disabled
                                                            />
                                                        </td>
                                                        {/* {formulaResponseArray.map((v, i) => ( */}
                                                        <><td>
                                                            <input
                                                                className="variableInput mt-2"
                                                                placeholder={''}
                                                                defaultValue={formulaResponseArray[index]?.val}
                                                                style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                disabled />
                                                        </td><td>
                                                                <input
                                                                    className="variableInput mt-2"
                                                                    placeholder={''}
                                                                    defaultValue={formulaResponseArray[index]?.roundedVal}
                                                                    style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                    disabled />
                                                            </td></>
                                                        {/* ))} */}
                                                        <td>
                                                            <input
                                                                className="variableInput mt-2"
                                                                placeholder={variable.formulaTypeUOM}
                                                                defaultValue={variable.formulaTypeUOM}
                                                                style={{ width: "100%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                disabled
                                                            />
                                                        </td>
                                                        <td>
                                                            {/* {index === 0 ? (
                                                                <div >
                                                                    <input
                                                                        className="variableInput mt-2"
                                                                        placeholder={selectedItem.formula}
                                                                        defaultValue={selectedItem.formula}
                                                                        style={{ width: "85%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            ) : ( */}
                                                            {/* <div> */}
                                                            {/* {selectedItem.childFormulas.map((childFormula, childIndex) => (
                                                                        childIndex + 1 === index && ( */}
                                                            {/* <div key={index} > */}
                                                            <input
                                                                className="variableInput mt-2"
                                                                placeholder={variable.formula}
                                                                defaultValue={variable.formula}
                                                                style={{ width: "85%", border: "1px solid", borderRadius: '3px', padding: "4px 6px" }}
                                                                disabled
                                                            />
                                                            {/* </div> */}
                                                            {/* )
                                                                    ))} */}
                                                            {/* </div>
                                                            )} */}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </Row>

                                    <Row>
                                        <Col sm={10}>

                                        </Col>
                                        <Col sm={2} className='p-0' >
                                            <button className='btn btn-primary mt-5' onClick={showChildAlert1}>
                                                Submit
                                            </button>
                                <Form.Text className="text-danger">{errors.projectNameError}</Form.Text>

                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Row>
                    </>
                ) : (
                    <p>No Formulas Available</p>
                )}
            </div >
        </section >
    );
};

export default GenerateResultsById;
