//VariableInputRows.jsx

import React from 'react';
import { Row, Col } from 'react-bootstrap';

// export const replaceLabelsWithValue = (formula, labels, values) => {
//     labels.forEach((lbl, idx) => {
//         const regex = new RegExp(lbl, 'g');
//         formula = formula.replace(regex, values[idx]);
//     }); 
//     return formula;
// };

const VariableInputRow = ({ index, variable, label, uom, values, displayFormat, roundedUpTo, onChange }) => (
    <Row key={index}>
        <Col sm={1}>
            {!index ? <label className='description'>S.No</label> : null}
            <input className='variablesInput' placeholder={`${index + 1}`} readOnly style={{ marginTop: '10px' }} />
        </Col>
        <Col sm={4}>
            {!index ? <label className='description'>Variable</label> : null}
            <input
                className='variablesInput'
                placeholder={`Enter Variable ${index + 1}`}
                value={variable}
                style={{ marginTop: '10px' }}
                onChange={(e) => onChange('variable', e.target.value, index)}
                disabled
            />
        </Col>
        <Col sm={1}>
            {!index ? <label className='description'>Label</label> : null}
            <input
                className='variablesInput'
                placeholder={`Enter Label ${index + 1}`}
                value={label}
                style={{ marginTop: '10px' }}
                onChange={(e) => onChange('label', e.target.value, index)}
                disabled
            />
        </Col>
        <Col sm={4}>
            {!index ? <label className='description'>Values</label> : null}
            <input
                className='variablesInput'
                placeholder={`Enter Values ${index + 1}`}
                value={values}
                style={{ marginTop: '10px' }}
                onChange={(e) => onChange('values', e.target.value, index)}
                

            />
        </Col>

        <Col sm={2}>
            {!index ? <label className='description'>UOM</label> : null}
            <input
                className='variablesInput'
                placeholder="Enter UOM"
                value={uom}
                style={{ marginTop: '10px' }}
                onChange={(e) => onChange('uom', e.target.value, index)}
                disabled
            />
        </Col>
    </Row>
);


export default VariableInputRow;
