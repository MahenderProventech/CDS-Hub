import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';
import VariableInputRow from '../components/VariableInputRow';
import formulasData from '../data/formulas.json';

const Home = () => {
    const [currentView, setCurrentView] = useState(1);
    const [variableInputs, setVariableInputs] = useState([
        { id: 1, variable: '', label: '', uom: '', displayFormat: '', roundedUpTo: '' },
    ]);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [selectedValidateFunction, setSelectedValidateFunction] = useState('');

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
    };

    const handleSelectFunction = (value) => {
        setSelectedFunction(value);
    };

    const handleSelectValidateFunction = (value) => {
        setSelectedValidateFunction(value);
    };

    const calculateValues = (selectedFunction, inputValues) => {
        const values = inputValues.map((variable) => parseFloat(variable.variable) || 0);

        let result = 0;

        switch (selectedFunction) {
            case 'SUM':
                result = values.reduce((acc, value) => acc + value, 0);
                break;
            case 'AVERAGE':
                result = values.length > 0 ? values.reduce((acc, value) => acc + value, 0) / values.length : 0;
                break;
            case 'COUNT':
                result = values.length;
                break;
            case 'MAX':
                result = Math.max(...values);
                break;
            case 'MIN':
                result = Math.min(...values);
                break;
            default:
                break;
        }
        alert(result)
        return {
            rawValue: result,
            roundedValue: Math.round(result * 100) / 100, // Round to 2 decimal places
        };
    };

    const [calculatedValues, setCalculatedValues] = useState({
        rawValue: 0,
        roundedValue: 0,
    });

    const handleCalculate = () => {
        alert(selectedFunction)
        console.log('Selected Function:', selectedFunction);
        console.log('Input Values:', variableInputs);

        if (selectedFunction && variableInputs.length > 0) {
            const result = calculateValues(selectedFunction, variableInputs);
            setCalculatedValues(result);
        } else {

            console.error('Please select a function and provide input values.');
        }
    };

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
                        <Container>
                            <Row>
                                <Col sm={8} style={{ border: '1px solid black', padding: '5px', background: '#d9d9d9', marginLeft: '-4px' }}>
                                    <Row>
                                        <Col sm={7}>
                                            {/* Content for the first column */}
                                            + - /
                                        </Col>
                                        <Col sm={5}>
                                            <Form.Select
                                                className='selectOption'
                                                onChange={(e) => handleSelectFunction(e.target.value)}
                                            >
                                                <option value=''>Select Function</option>
                                                {formulasData.map((formula) => (
                                                    <option key={formula.Id} value={formula.Formula}>
                                                        {formula.FormulaDisplayName} ({formula.Formula})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={4}></Col>
                            </Row>


                        </Container>
                        <Row>
                            <Col sm={8}>
                                <textarea
                                    rows={10}
                                    style={{
                                        width: '-webkit-fill-available', padding: '10px',
                                        fontSize: '14px'
                                    }}
                                    value={selectedFunction.length > 0 ? `${selectedFunction}(${variableInputs.map((variable, index)   => `variable${index + 1}`).join(', ')})` : ''}
                                    
                                ></textarea>
                            </Col>
                        </Row>
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
                                <button className='calculate' onClick={handleCalculate}>
                                    Calculate
                                </button><br />
                            </Col>
                            <Row>
                                <Col sm={7} className='claGenerated'>
                                    <p>
                                        {selectedFunction.length > 0
                                            ? `${selectedFunction}(${variableInputs.map((variable) => variable.variable).join(', ')})`
                                            : ''}
                                    </p>
                                    <p>Raw Value: {calculatedValues.rawValue}</p>
                                    <p>Rounded Value: {calculatedValues.roundedValue}</p>
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
