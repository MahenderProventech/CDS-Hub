import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from './Http';
import check from '../img/check.png';

const BatchResult = () => {
    const [formulaGroups, setFormulaGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormulaGroups = async () => {
            try {
                const response = await http.get("Configuration/GetFormulaGroups");
                if (response.data && response.data.item1) {
                    setFormulaGroups(response.data.item2);
                } else {
                    console.error('Unexpected response format', response);
                }
            } catch (error) {
                console.error('Error fetching formula groups:', error.response ? error.response.data : error.message);
            }
        };

        fetchFormulaGroups();
    }, []);

    const handleCardClick = (configureValue) => {
        navigate(`/home/generateResultsById/${configureValue}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredFormulaGroups = formulaGroups.filter(group =>
        group.configureValue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="pt-3 pb-5 full_screen" style={{ paddingRight: "110px" }}>
            <div className="container-fluid text-center">
                <div className="row justify-content-md-center sMain">
                    <div className="row" style={{ marginLeft: "80px" }}>
                        <div className="col-12 mb-4">
                            <input
                                type="text"
                                placeholder="Search by Group Names"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="formulaName"
                                style={{ width: "300px", border:'1px solid', float:'right' }}
                            />
                        </div>
                        {filteredFormulaGroups.map(group => (
                            <div className="col-sm-3 mt-5" key={group.id}>
                                <div className="card card-client" onClick={() => handleCardClick(group.configureValue)}>
                                    <div className="checkIcon"><img src={check} alt="check" /></div>
                                    <div className="titles">
                                        <h3 style={{ fontSize: "15px" }}>{group.configureValue}</h3>
                                        <p>{group.configureValue} Formulas</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BatchResult;
