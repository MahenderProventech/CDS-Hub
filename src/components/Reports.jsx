import React, { useState } from 'react';
import { Row, Col,Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Appconstant from '../services/AppConstantService';
import axios from 'axios';
import HtmlTemplateModal from './core/HtmlTemplateModal';
import ReportTableComponent from './Authentication/ReportTableComponent';
import ExportToPDF from './core/ExportToPDF';
import jsPDF from 'jspdf';

const Reports = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [productName, setProductName] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [htmlTemplate, setHtmlTemplate] = useState('');

    const [showReportsList, setShowReportsList] = useState([]);
    const [showPDF, setShowPDF] = useState(false);

    const submitData = async () => {
        console.log(productName)
        console.log(batchNumber)
        try {
            console.log(Appconstant.getReportsList + `ProductName=${productName}&BatchId=${batchNumber}`);
            const response = await axios.get(Appconstant.getReportsList + `ProductName=${productName}&BatchId=${batchNumber}`);
            console.log("getResultsReport", response.data.item2);
            setShowReportsList(response.data.item2)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getReportContent = async (type) => {
        const response = await axios.get(Appconstant.getResultsReport + `ProductName=${productName}&BatchId=${batchNumber}`);
        // const headerResponse = await axios.get(Appconstant.getResultsReportHeader + `ProductName=${productName}&BatchId=${batchNumber}`);
        // const footerResponse = await axios.get(Appconstant.getResultsReportFooter + `ProductName=${productName}&BatchId=${batchNumber}&CurrentUser=User007`);

        setHtmlTemplate(response.data.item2);
        if (type == 'v') {
            handleShow();
        } else {
            handleShow();
            setShowPDF(true);
        }
    }

    return (
        <section className="pb-5 full_screen">
            <nav aria-label="breadcrumb" className="mainBreadcrumb">
                <div className="position-relative">
                    <ol className="breadcrumb" style={{padding:'0px',background:'none'}}>
                        <li className="breadcrumb-item" style={{ color: 'black' }}>Reports</li>
                    </ol>
                    <div className="btnSet">
                        <Link className="btn btn-primary me-2" to={"/home/batchresult"}>Back</Link>
                    </div>
                </div>
            </nav>
            <div style={{ paddingLeft: "50px", marginTop: '30px' }}>
                <Row>
                    <Col sm={3}>
                        <p className='generateIdNames'>Product Name/Code</p>
                        <input
                            className="formulaName mt-2"
                            placeholder='Enter Product Name/Code'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <p className='generateIdNames'>Batch Number</p>
                        <input
                            className="formulaName mt-2"
                            placeholder='Enter Batch ID'
                            value={batchNumber}
                            onChange={(e) => setBatchNumber(e.target.value)}
                        />
                    </Col>

                </Row>
                <Row>
                    <Col sm={12}>
                        <button
                            id="submit-btn"
                            className="btn btn-primary mt-4"
                            onClick={submitData}
                            disabled={!productName && !batchNumber}
                        >
                            Search
                        </button>
                    </Col>
                </Row>
            </div>
            {showReportsList.length &&
                <ReportTableComponent data={showReportsList} getReportContent={() => getReportContent('v')} downloadFile={() => { console.log("downloadddd"); getReportContent('d') }} />
            }
            {show &&
                <HtmlTemplateModal htmlTemplate={htmlTemplate} handleModal={show} handleClose={() => handleClose()} showPDF={showPDF} />
            }
        </section>
    );
};

export default Reports;
