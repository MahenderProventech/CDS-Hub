import './CustomModalCss.css';
import React from 'react';
import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const CustomTableComponent = ({ label, headers, tableData, type }) => {
    return (
        <Container className="table-container">
            <h2>{label}</h2>
            <Table striped bordered hover style={{tableLayout:'fixed'}}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {type === 'input' && tableData.map((data, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.variable}</td>
                            <td>{data.variableLabel}</td>
                            <td>{data.variableDisplayFormat}</td>
                            <td>{data.uom}</td>
                        </tr>
                    ))}
                    {type === 'formula' && tableData.map((data, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="wrap-text">{data.formulaDispayDescription}</td>
                            {/* <td className="wrap-text">{data.formulaDispayDescription}</td> */}
                            <td className="wrap-text">{data.formulaCode}</td>
                            <td className="wrap-text">{data.roundedValue}</td>
                            <td>{data.formulaTypeUOM}</td>
                            <td className="wrap-text" style={{ width: '350px' }}>{data.formula}</td>
                        </tr>
                    ))}
                    {type === 'audit' && tableData.map((data, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.name}</td>
                            <td>{data.reason}</td>
                            <td>{data.actions}</td>
                            <td>{data.createdBy}</td>
                            <td>{data.createdDate}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default CustomTableComponent;
