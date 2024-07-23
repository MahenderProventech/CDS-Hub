import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CreatedImg from '../../../img/math.png'
import AssignedImg from '../../../img/assigned.png'
import ActiveImg from '../../../img/active.png'
import ReviewImg from '../../../img/review.png';

import http from '../../Http'

const Dashboard = () => {

    const [rowData, setRowData] = useState([])

    const [counterData, setCounterData] = useState({
        totalFormulaCreated: 0,
        totalFormulasApproved: 0,
        totalFormulasRejected: 0,
        totalFormulasUnderApproval: 0,
    });


    const [cardsData, setCardsData] = useState({
        allData: [],
        activeData: [],
        assignedData: [],
        inActiveData: [],
        rawData: []
    })

    const resp = {
        data: {
            "item1": true,
            "item2": {
                "totalFormulaCreated": 1,
                "dashboardGridData": [
                    {
                        "formulaId": "GLB/AS/01",
                        "createdBy": "User",
                        "createdOn": "2024-03-25T13:45:00",
                        "status": "in-Active",
                        "description": "TestFormula",
                        "action": "-"
                    },
                    // {
                    //     "formulaId": "GLB/AS/02",
                    //     "createdBy": "User",
                    //     "createdOn": "2024-03-25T13:45:00",
                    //     "status": "Pending for Approval ",
                    //     "description": "TestFormula",
                    //     "action": "-"
                    // },
                    // {
                    //     "formulaId": "GLB/AS/03",
                    //     "createdBy": "User",
                    //     "createdOn": "2024-03-25T13:45:00",
                    //     "status": "Ready to Assign",
                    //     "description": "TestFormula",
                    //     "action": "-"
                    // },
                    // {
                    //     "formulaId": "GLB/AS/04",
                    //     "createdBy": "User",
                    //     "createdOn": "2024-03-25T13:45:00",
                    //     "status": "Assigned",
                    //     "description": "TestFormula",
                    //     "action": "-"
                    // },
                ]
            }
        }
    }

    useEffect(() => {
        http.get("Formulas/GetDashboard").then((resp) => {
            let rawData = [...resp.data.item2.dashboardGridData];

            // Sorting data by descending order
            rawData.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));


            setRowData(rawData);

            let gridData = [];
            let approvedCount = 0;
            let rejectedCount = 0;
            let underApprovalCount = 0;

            rawData.forEach((each) => {
                if (each.formulaId) {
                    gridData.push(each);
                    if (each.status.trim().toLowerCase() === 'approved') {
                        approvedCount++;
                    } else if (each.status.trim().toLowerCase() === 'rejected') {
                        rejectedCount++;
                    } else if (each.status.trim().toLowerCase() === 'under approval') {
                        underApprovalCount++;
                    }
                }
            });

            setRowData(gridData);

            setCounterData({
                totalFormulaCreated: gridData.length,
                totalFormulasApproved: approvedCount,
                totalFormulasRejected: rejectedCount,
                totalFormulasUnderApproval: underApprovalCount,
            });

        }).catch((err) => {
            console.log("GetDashboard err", err);
        });
    }, []);


    return (
        <>
            <section className="full_screen">
                <nav aria-label="breadcrumb" className="mainBreadcrumb">
                    <div className="position-relative">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to={"/home/dashboard"}>Dashboard</Link></li>
                        </ol>
                        <div className="btnSet">
                            <Link className="btn btn-primary" to={"/home/create-formula"}>Create</Link>
                        </div>
                    </div>
                </nav>

                <div className="cardMain">
                    <div className="row">
                        <div className="col">
                            <a href="#!" className="d-card">
                                <h3>{counterData.totalFormulaCreated}</h3>
                                <p>Total Formula's Created</p>
                                {/* <span><img src={CreatedImg} alt="assign" /></span> */}
                            </a>
                        </div>
                        <div className="col">
                            <a href="#!" className="d-card">
                                <h3>{counterData.totalFormulasApproved}</h3>
                                <p>Total Formulas Approved</p>
                                {/* <span><img src={AssignedImg} alt="assign" /></span> */}
                            </a>
                        </div>
                        <div className="col">
                            <a href="#!" className="d-card">
                                <h3>{counterData.totalFormulasRejected}</h3>
                                <p>Total Formulas Rejected</p>
                                {/* <span><img src={ActiveImg} alt="assign" /></span> */}
                            </a>
                        </div>
                        <div className="col">
                            <a href="#!" className="d-card">
                                <h3>{counterData.totalFormulasUnderApproval}</h3>
                                <p>Total Formulas Under Approval</p>
                                {/* <span><img src={ReviewImg} alt="assign" /></span> */}
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{padding:'10px 40px 0px 25px'}}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="text-center1">S. No.</th>
                                <th>Formula ID</th>
                                <th>Description</th>
                                <th width="100px">Created By</th>
                                <th>Created On</th>
                                <th width="120px">Status</th>

                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rowData.map((each, index) => {
                                    let { createdOn, status } = each;
                                    const date = new Date(createdOn);
                                    let iconClasses = ["pencil icon"];
                                    let actualStatus = status.trim().toLowerCase();
                                    let substate = "";

                                    if (actualStatus === "under approval") {
                                        iconClasses = [];
                                        substate = "orange";
                                    } else if (actualStatus === "rejected") {
                                        substate = "red";
                                        iconClasses.unshift("start icon");
                                    } else if (actualStatus === "approved") {
                                        iconClasses.unshift("icon eye");
                                        substate = "green";
                                    }

                                    const formattedDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString([], { hour12: false })}`;

                                    return (
                                        <React.Fragment key={each.formulaId}>
                                            <tr>
                                                <td >{index + 1}</td>
                                                <td ><Link to={`/home/get-formula-by-id/${each.id}`}>{each.formulaId}</Link></td>
                                                <td >{each.description}</td>
                                                <td >{each.createdBy}</td>
                                                <td >{formattedDate}</td>
                                                <td ><span style={{fontSize:'smaller',paddingTop:'4px'}} className={`state ${substate}`}>{status}</span></td>
                                                {/* <td>-</td> */}
                                            </tr>
                                        </React.Fragment>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default Dashboard