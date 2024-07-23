import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';
import VariableInputRow, { replaceLabelsWithValue } from '../components/VariableInputRow'; 
import FunctionDropdown from '../components/Dropdown';
import { FaPlus, FaDivide, FaPercentage, FaMinus, FaGreaterThan, FaLessThan, FaGreaterThanEqual, FaLessThanEqual } from "react-icons/fa";
import { FaStarOfLife } from "react-icons/fa6";
import { PiBracketsRoundBold } from "react-icons/pi";
import FormulaValidationApi from '../components/FormulaValidationApi';
import './styles.css';





const Home = () => {
    const [currentView, setCurrentView] = useState(1);
    const [variableInputs, setVariableInputs] = useState([
        { id: 1, variable: '', label: '', uom: '', displayFormat: '', roundedUpTo: '', values: [] },
    ]);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [selectedValidateFunction, setSelectedValidateFunction] = useState('');
    const [formula, setFormula] = useState('');
    const [rawValue, setRawValue] = useState('');
    const [roundedValue, setRoundedValue] = useState('');
    const [responseData, setResponseData] = useState(null);

    const handleButtonClick = (text) => {
        setFormula(prevFormula => prevFormula + text);
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

    const handleVariableInputChange = (property, value, index) => {
        const updatedVariables = [...variableInputs];
        updatedVariables[index][property] = value;
        setVariableInputs(updatedVariables);

        console.log(updatedVariables)
        

        
    };

    // const handleCalculate = () => {
        
         
    //     try {
             
    //         const variables = {};
    //         variableInputs.forEach(({ label, updatedVariables }) => {
    //              const values = updatedVariables.values;
    //             console.log(values)

    //             if (label && Array.isArray(values) && values.length > 0) {
    //                 variables[label] = values.reduce((acc, curr) => acc + curr, 0);  
    //             }
    //         });
    //         alert(variableInputs)

    
    //         // Evaluate the formula with initialized variables
    //         const result = eval(formula.replace(/([a-zA-Z]+)(?![0-9])/g, (match, p1) => variables[p1] || 0));
    
    //         // Update the raw and rounded values
    //         setRawValue(result);
    //         const roundedResult = Math.round(result * 100) / 100;
    //         setRoundedValue(roundedResult);
    
    //         // Call the API with the expression
    //         const apiUrl = `http://localhost:58747/api/Formulas/FormulaValidation?expression=${encodeURIComponent(formula)}`;
    //         fetch(apiUrl)
    //             .then(response => response.json())
    //             .then(data => {
    //                 // Handle the response if needed
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching data:', error);
    //             });
    //     } catch (error) {
    //         console.error('Error calculating expression:', error);
    //     }

    // };

    const formulaString = variableInputs.map(input => input.label).join(' + ');
    


    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div>
                            <span>
                                <button
                                    style={{ border: 'none', padding: '5px 25px' }}
                                    className={currentView === 1 ? 'active' : ''}
                                    onClick={() => showView(1)}
                                >
                                    Create
                                </button>
                                <button
                                    style={{ border: 'none', padding: '5px 25px' }}
                                    className={currentView === 2 ? 'active' : ''}
                                    onClick={() => showView(2)}
                                >
                                    Validate
                                </button>
                            </span>
                        </div>
                    </Col>
                </Row>

                {currentView === 1 && (
                    <>
                        <Row>
                            <Col className='createData' sm={8}>
                                <h5 className='description'> Description</h5>
                                <input type='text' className='descInput' placeholder="" />
                            </Col>
                        </Row>
                        {variableInputs.map((variable, index) => (
                            <Row key={variable.id}>
                                <Col sm={1}>
                                    {!index ? (
                                        <label className='description'>S.No</label>
                                    ) : null}
                                    <input className='variablesInput' placeholder={`${index + 1}`} readOnly />
                                </Col>
                                <Col sm={2}>
                                    {!index ? (
                                        <label className='description'>Variable</label>
                                    ) : null}
                                    <input
                                        className='variablesInput'
                                        placeholder={`Enter Variable ${index + 1}`}
                                        value={variable.variable}
                                        onChange={(e) => {
                                            const updatedVariables = [...variableInputs];
                                            updatedVariables[index].variable = e.target.value;
                                            setVariableInputs(updatedVariables);
                                        }}
                                    />
                                </Col>
                                <Col sm={2}>
                                    {!index ? (
                                        <label className='description'>Label</label>
                                    ) : null}
                                    <input
                                        className='variablesInput'
                                        placeholder={`Enter Label ${index + 1}`}
                                        value={variable.label}
                                        onChange={(e) => {
                                            const updatedVariables = [...variableInputs];
                                            updatedVariables[index].label = e.target.value;
                                            setVariableInputs(updatedVariables);
                                        }}
                                    />
                                </Col>
                                <Col sm={2}>
                                    {!index ? (
                                        <label className='description'>UOM</label>
                                    ) : null}
                                    <input
                                        className='variablesInput'
                                        placeholder="Enter UOM"
                                        value={variable.uom}
                                        onChange={(e) => {
                                            const updatedVariables = [...variableInputs];
                                            updatedVariables[index].uom = e.target.value;
                                            setVariableInputs(updatedVariables);
                                        }}
                                    />
                                </Col>
                                <Col sm={2}>
                                    {!index ? (
                                        <label className='description'>Display Format</label>
                                    ) : null}
                                    <input
                                        className='variablesInput'
                                        placeholder="AsEntered"
                                        value={variable.displayFormat}
                                        onChange={(e) => {
                                            const updatedVariables = [...variableInputs];
                                            updatedVariables[index].displayFormat = e.target.value;
                                            setVariableInputs(updatedVariables);
                                        }}
                                    />
                                </Col>
                                <Col sm={2}>
                                    {!index ? (
                                        <label className='description'>Rounded up to</label>
                                    ) : null}
                                    <input
                                        className='variablesInput'
                                        placeholder="2"
                                        value={variable.roundedUpTo}
                                        onChange={(e) => {
                                            const updatedVariables = [...variableInputs];
                                            updatedVariables[index].roundedUpTo = e.target.value;
                                            setVariableInputs(updatedVariables);
                                        }}
                                    />
                                </Col>

                            </Row>
                        ))}
                        <Row>
                            <Col>
                                <button className='me-2' onClick={handleAddVariable}>
                                    <CiCirclePlus className='circlePlus' />
                                </button>
                                <button className='me-2' style={{ marginLeft: '20px' }} onClick={handleRemoveVariable}>
                                    <CiCircleMinus className='circlePlus' />
                                </button>
                            </Col>
                        </Row>
                        <div>
                            <Container style={{ marginTop: "50px" }}>
                                {/* Buttons for adding mathematical operators */}
                                <Row style={{ marginBottom: '5px' }}>
                                    <Col sm={8}>
                                        <button className='SquareClass ' onClick={() => handleButtonClick('+')}>
                                            <FaPlus />
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('-')}>
                                            <FaMinus />
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('*')}>
                                            <FaStarOfLife />

                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('/')}>
                                            <FaDivide />

                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('%')}>
                                            <FaPercentage />
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('<')}>
                                            <FaLessThan />
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('>')}>
                                            <FaGreaterThan />
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('≤')}>
                                            <FaLessThanEqual />
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('≥')}>
                                            <FaGreaterThanEqual />
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('( )')}>
                                            <PiBracketsRoundBold />

                                        </button>

                                    </Col>
                                    <Col sm={4}>
                                        <FunctionDropdown className="DropdownFunctions" handleButtonClick={handleButtonClick} />
                                    </Col>
                                </Row>
                                <Row style={{ marginBottom: '5px' }}>
                                    {/* <Col>
                                        <button className='SquareClass ' onClick={() => handleButtonClick('Sum( )')}>
                                            <b> Sum( )</b>
                                        </button>
                                        <button className='SquareClass ' style={{ marginLeft: '10px' }} onClick={() => handleButtonClick('Avg( )')}>
                                            <b> Average( )</b>
                                        </button>


                                    </Col> */}
                                    {/* <FunctionDropdown handleButtonClick={handleButtonClick} /> */}

                                </Row>

                                {/* Textarea to display and edit the formula */}
                                <Row>
                                    <Col>
                                        <textarea
                                            id="textArea"
                                            rows={10}
                                            style={{
                                                width: '-webkit-fill-available', padding: '10px',
                                                fontSize: '14px'
                                            }}
                                            value={formula}
                                            onChange={(e) => setFormula(e.target.value)}
                                        ></textarea>
                                    </Col>
                                </Row>
                            </Container>
                        </div>


                    </>
                )}

                {currentView === 2 && (
                    <>

                        <Row>
                            <Col className='createData' sm={8}>
                                <h5 className='description'> Description</h5>
                                <input type='text' className='descInput' placeholder="" />
                            </Col>
                        </Row>

                        <Row>
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
                                        roundedUpTo={variable.roundedUpTo}
                                        onChange={handleVariableInputChange}
                                    />
                                ))}
                            </Col>
                        </Row>
                        <Row>
                            <Col className='createData' sm={8}>
                                <h5 className='description'> Reference:</h5>
                                <input type='text' className='descInput' placeholder="" />
                            </Col>
                        </Row>
                        {/* <Row> */}
                        <Row>
                            <Col sm={3}>
                                {/* <button className='calculate' onClick={handleCalculate}>
                                    Calculate
                                </button> */}
                                <br />
                            </Col>
                            <Row>
                                <Col sm={7} className='claGenerated' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <div>
                                        <p>Formula = {formula}</p>
                                        
                                        <p>
                                            Expression={formula.length > 0
                                                ? replaceLabelsWithValue(formula, variableInputs.map(v => v.label), variableInputs.map(v => v.values))
                                                : ''}
                                        </p>
                                        {/* <p>Raw Value: {responseData.item2}</p>
                                        <p>Rounded Value: {roundedValue}</p> */}
                                        <FormulaValidationApi
                        formula={formula}
                        variableInputs={variableInputs}
                        responseData={responseData} // Pass responseData as a prop
                    />
                                    </div>
                                     
                                    {/* <FormulaValidationApi formula={formulaString} variableInputs={variableInputs} /> */}

                                </Col>
                            </Row>

                        </Row>





                        <Row>
                            <Col sm={4}>
                                <button className='calculate'>Save</button>
                            </Col>
                        </Row>

                    </>
                )}
            </Container>
        </div>
    );
};

export default Home;
