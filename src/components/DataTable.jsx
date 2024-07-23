import React, { useState, useEffect } from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./DataTable.css";
// import "./Dashboard.css";
 
import http from './Http';
import { Link } from 'react-router-dom';

const DataTable = () => {
    const [datatableUsers, setDatatableUsers] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rowData, setRowData] = useState([]);

    const [counterData, setCounterData] = useState({
        totalFormulaCreated: 0,
        totalFormulasApproved: 0,
        totalFormulasRejected: 0,
        totalFormulasUnderApproval: 0,
    });

    const filterData = (status) => {
        setCurrentFilter(status);
        const filtered = applyFilters(rowData, status);
        setFilteredData(filtered);
        setCurrent(1); // Reset to the first page when filters are applied
    };

    const applyFilters = (data, status) => {
        let filtered = data;

        if (status !== 'all') {
            filtered = filtered.filter(each => each.status.trim().toLowerCase() === status);
        }

        if (startDate) {
            filtered = filtered.filter(each => new Date(each.createdOn) >= new Date(startDate));
        }

        if (endDate) {
            // Adding one day to the end date to include the entire day
            const inclusiveEndDate = new Date(endDate);
            inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
            filtered = filtered.filter(each => new Date(each.createdOn) < inclusiveEndDate);
        }

        return filtered;
    };

    useEffect(() => {
        // Fetch data on component mount
        http.get("Formulas/GetDashboard")
            .then((resp) => {
                let rawData = [...resp.data.item2.dashboardGridData];

                // Sorting data by descending order
                rawData.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
                console.log("Sorted rawData:", rawData);
                let gridData = [];
                rawData.forEach((each) => {
                    if (each.formulaId) {
                        gridData.push(each);
                    }
                });

                setDatatableUsers(gridData);
                setRowData(gridData); // Store the original data
                setFilteredData(gridData); // Set the filtered data initially
                updateCounterData(gridData); // Update the counter data
            })
            .catch((err) => {
                console.log("GetDashboard err", err);
            });
    }, []);

    const updateCounterData = (data) => {
        const totalFormulaCreated = data.length;
        const totalFormulasApproved = data.filter(each => each.status.trim().toLowerCase() === 'approved').length;
        const totalFormulasRejected = data.filter(each => each.status.trim().toLowerCase() === 'rejected').length;
        const totalFormulasUnderApproval = data.filter(each => each.status.trim().toLowerCase() === 'under approval').length;

        setCounterData({
            totalFormulaCreated,
            totalFormulasApproved,
            totalFormulasRejected,
            totalFormulasUnderApproval
        });
    };

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(getFilteredData().length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    };

    const getFilteredData = () => {
        let filteredData = applyFilters(datatableUsers, currentFilter);
        if (searchTerm) {
            filteredData = filteredData.filter((data) =>
                Object.values(data).some((value) =>
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        return filteredData;
    };

    const getData = (current, pageSize) => {
        const filteredData = getFilteredData();
        return filteredData.slice((current - 1) * pageSize, current * pageSize).map((data, index) => {
            let { createdOn, status } = data;
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

            return {
                ...data,
                formattedDate: formatDate(createdOn),
                iconClasses,
                substate
            };
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString([], { hour12: false })}`;
        console.log("newdate", date)
        return formattedDate;
    };

    const PaginationChange = (page) => {
        setCurrent(page);
    };

    const PrevNextArrow = (current, type, originalElement) => {
        if (type === 'prev') {
            return <button><i className="fa fa-angle-double-left"></i></button>;
        }
        if (type === 'next') {
            return <button><i className="fa fa-angle-double-right"></i></button>;
        }
        return originalElement;
    };

    const handleSearch = () => {
        setCurrent(1); // Reset pagination to the first page when searching
        const filtered = applyFilters(rowData, currentFilter);
        setFilteredData(filtered);
    };

    return (
        <>
            <section className="full_screen">
                <nav aria-label="breadcrumb" className="mainBreadcrumb p-0">
                    <div className="position-relative">
                        <ol className="breadcrumb" style={{fontSize:'12px',background:'white'}}>
                            <li className="breadcrumb-item"><Link to={"/home/master-dashboard"}>Masters Dashboard</Link></li>
                        </ol>
                    </div>
                </nav>

                <div className="filters">
                    <div className="row" style={{backgroundColor:"white"}}>
                        <div className="col-sm-3 " style={{marginLeft:'20px'}}>
                            <p className='mt-2 startDatesCss ' style={{ backgroundColor: "#fff", color: "#000", fontWeight:"600", marginBottom:'2px'}}>Start Date</p>
                            <input
                                className='form-control mb-2 startDateInputs'
                                style={{width:'80%'}}
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 ">
                            <p className='mt-2 startDatesCss' style={{ backgroundColor: "#fff", color: "#000", fontWeight:"600", marginBottom:'2px'}}>End Date</p>
                            <input
                                className='form-control mb-2 startDateInputs'
                                style={{width:'80%'}}
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 " style={{marginTop:'30px'}}>
                            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                </div>

                <div className="cardMain">
                    <div className="row">
                        <div className="col">
                            <a href="#!" className="d-card" onClick={() => filterData('all')}>
                                <h3>{counterData.totalFormulaCreated}</h3>
                                <p style={{fontSize:'13px'}}>Total Formula's Created</p>
                            </a>
                        </div>
                        <div className="col">
                            <a href="#!" className="d-card" onClick={() => filterData('approved')}>
                                <h3>{counterData.totalFormulasApproved}</h3>
                                <p style={{fontSize:'13px'}}>Total Formulas Approved</p>
                            </a>
                        </div>
                        <div className="col">
                            <a href="#!" className="d-card" onClick={() => filterData('rejected')}>
                                <h3>{counterData.totalFormulasRejected}</h3>
                                <p style={{fontSize:'13px'}}>Total Formulas Rejected</p>
                            </a>
                        </div>
                        <div className="col">
                            <a href="#!" className="d-card" onClick={() => filterData('under approval')}>
                                <h3>{counterData.totalFormulasUnderApproval}</h3>
                                <p style={{fontSize:'13px'}}>Total Formulas Under Approval</p>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="container-fluid pt-3 pb-5" style={{background:"white"}}>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-filter-info">
                                    <Pagination
                                        className="pagination-data"
                                        showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                        onChange={PaginationChange}
                                        total={getFilteredData().length}
                                        current={current}
                                        pageSize={size}
                                        showSizeChanger={false}
                                        itemRender={PrevNextArrow}
                                        onShowSizeChange={PerPageChange}
                                    />
                                </div>
                                <div className="table-responsive-x">
                                    <table className="table table-text-small mb-0">
                                        <thead className="thead table-sorting">
                                            <tr>
                                                <th>#</th>
                                                <th width="350px">Formula Id</th>
                                                <th width="350px">Description</th>
                                                <th>Created By</th>
                                                <th>Created On</th>
                                                <th>Status</th>
                                                <th>Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getData(current, size).map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.formulaId}</td>
                                                    <td>{data.description}</td>
                                                    <td>{data.createdBy}</td>
                                                    <td>{formatDate(data.createdOn)}</td>
                                                    <td>
                                                        <span style={{ fontSize: 'smaller', paddingTop: '4px' }} className={`state ${data.substate}`}>
                                                            {data.status}
                                                        </span>
                                                    </td>
                                                    <td>{data.comments}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-filter-info">
                                    <Pagination
                                        className="pagination-data"
                                        showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                        onChange={PaginationChange}
                                        total={getFilteredData().length}
                                        current={current}
                                        pageSize={size}
                                        showSizeChanger={false}
                                        itemRender={PrevNextArrow}
                                        onShowSizeChange={PerPageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DataTable;
