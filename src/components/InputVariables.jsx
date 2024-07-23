//InputVariable.jsx

import React, { useState } from 'react';
import { GiConsoleController } from 'react-icons/gi';


const InputVariableTable = ({ variableInputs, setVariableInputs,isDisabled }) => {
  console.log(variableInputs);

  return (
    <table className="mainTable mt-5">
      <thead>
        <tr>
          <th width="60">S. No.</th>
          <th width='500'>Input Variables</th>
          <th>Label</th>
          <th>Values</th>
          <th>UOM</th>
          <th width="200"></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {variableInputs.map((variable, index) => (
          <tr className="ui-sortable-handle" key={index}>
            <td><input type="text" className="text-center" placeholder={`${index + 1}`} readOnly style={{ position: 'relative' }} disabled /></td>
            <td>
              <input type="text" placeholder={`Enter Variable ${index + 1}`}
                value={variable.variable}
                className='variablesInput'
                onChange={(e) => {
                  const updatedVariables = [...variableInputs];
                  updatedVariables[index].variable = e.target.value;
                  setVariableInputs(updatedVariables);
                }} disabled />
            </td>
            <td>
              <input type="text" placeholder={`Enter Label ${index + 1}`}
                value={variable.variableLabel}
                className='variablesInput'
                disabled
                onChange={(e) => {
                  const userInput = e.target.value;
                  const regex = /^[A-Za-z]+$/;

                  if (regex.test(userInput) || userInput === '') {
                    const updatedVariables = [...variableInputs];
                    updatedVariables[index].variableLabel = e.target.value.trim();
                    setVariableInputs(updatedVariables);
                  }
                }} />
            </td>
            <td>
            <input 
                className='variablesInput'
                placeholder="Enter Values"
                value={variable.variableDisplayFormat}
                onChange={(e) => {
                  const updatedVariables = [...variableInputs];
                  updatedVariables[index].variableDisplayFormat = e.target.value;
                  setVariableInputs(updatedVariables);
                }} 
                disabled={isDisabled}
              />
            </td>
            
            <td>
              <input disabled
                className='variablesInput'
                placeholder="Enter UOM"
                value={variable.uom}
                onChange={(e) => {
                  const updatedVariables = [...variableInputs];
                  updatedVariables[index].uom = e.target.value;
                  setVariableInputs(updatedVariables);
                }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InputVariableTable;
