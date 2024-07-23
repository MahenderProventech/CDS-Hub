import React, { useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Table } from 'react-bootstrap';
import './CustomModalCss.css';
import provenTechLogo from '../../img/provenLogo.svg';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CustomTableComponent from './CustomTableComponent';

const HtmlTemplateModal = ({ htmlTemplate, handleModal, handleClose, showPDF }) => {
    const batchReportHeaders = ['S.No', 'Variable Inputs', 'Label Inputs', 'Values', 'UOM'];
    const auditReportHeaders = ['S.No', 'BatchId', 'Comments', 'Action', 'Created By', 'Created On'];
    const batchReportChildFormulaHeaders = ['S.No', 'Description', 'Label', 'Results', 'UOM', 'Formulas'];

    const exportToPdf = () => {
        const pdfContainer = document.getElementById('pdf-container');
        const closeButton = document.getElementById('close-button');
        const noRecordsMessages = document.querySelectorAll('.no-records-message');

        // Hide the close button and no records messages during PDF generation
        closeButton.style.display = 'none';
        noRecordsMessages.forEach(message => message.style.display = 'none');

        html2canvas(pdfContainer, { scale: 2 }).then(canvas => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 10;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Function to add table structure to the PDF
            const addTableToPdf = (canvas, pdf, position) => {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth - margin * 2, imgHeight);
            };

            addTableToPdf(canvas, pdf, position);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                addTableToPdf(canvas, pdf, position);
                heightLeft -= pageHeight;
            }

            pdf.save(htmlTemplate.productName + '.pdf');

            // Show the close button and no records messages again after PDF generation
            closeButton.style.display = 'block';
            noRecordsMessages.forEach(message => message.style.display = 'block');
        });
    };

    useEffect(() => {
        if (showPDF) {
            exportToPdf();
        }
    }, [showPDF]);

    return (
        <>
            <Modal show={handleModal} onHide={handleClose} size="lg">
                <div id="pdf-container">
                    <Modal.Header closeButton className="modal-header">
                        <Container>
                            <Row>
                                <Col sm={3}></Col>
                                <Col sm={6}></Col>
                                <Col sm={3} className="text-right mb-3"> <img src={provenTechLogo} height="40" width="175" alt="logo" /></Col>
                            </Row>
                            <Table bordered className="mt-3">
                                <tbody>
                                    <tr>
                                        <td><strong>Product Name :</strong> {htmlTemplate.productName}</td>
                                        <td><strong>Batch Id :</strong> {htmlTemplate.batchId}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Group Name :</strong> {htmlTemplate.groupvalue}</td>
                                        <td><strong>Test Name :</strong> {htmlTemplate.testName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Formula Details :</strong> {htmlTemplate.formulaCode}</td>
                                        <td><strong>Created By :</strong> {htmlTemplate.createdBy}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Project Name :</strong> {htmlTemplate.projectName}</td>
                                        <td><strong>Project Id :</strong> {htmlTemplate.projectId}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Container>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <CustomTableComponent headers={batchReportHeaders} tableData={htmlTemplate.executionFormulaVariableInfo} label="Input Details" type={'input'} />
                        <CustomTableComponent headers={batchReportChildFormulaHeaders} tableData={htmlTemplate?.executionChildFormula.filter(o => o.formulaType === 'child')} label="Child Formula and Results" type={'formula'} />
                        <CustomTableComponent headers={batchReportChildFormulaHeaders} tableData={htmlTemplate?.executionChildFormula.filter(o => o.formulaType === 'final')} label="Final Formula and Results" type={'formula'} />
                        <CustomTableComponent headers={auditReportHeaders} tableData={htmlTemplate.auditDetails} label="Audit Details" type={'audit'} />
                    </Modal.Body>
                    <Modal.Footer className="modal-footer">
                        <div id="pdf-footer">This report is generated digitally. No manual signatures are required.</div>
                        <Button id="close-button" variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
};

export default HtmlTemplateModal;
