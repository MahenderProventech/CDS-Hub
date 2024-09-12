import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import http from './Http';
import check from '../img/check.png';


//const IdleTimer=({timeout,onIdle})=>{
  //  const [idleTimeout,setIdelTimeout]=useState(null);
//}

const Configuration = () => {
    const [formulaGroups, setFormulaGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // const resetTimer=()=>{
        //     clearTimeout(idleTimeout);
        //     setIdelTimeout(setTimeout(onIdle,timeout));
        // };

//         const handleUserActivity=()=>{
//             resetTimer();
//         };
// document.addEventListener('mousemove',handleUserActivity);
// document.addEventListener('keypress',handleUserActivity);

// clearTimeout(idleTimeout);




   
        const fetchFormulaGroups = async () => {
            try {
                const response = await http.get("Configuration/GetConfigurationMasters");
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
    },[]);
   //  }, [idleTimeout.timeout,onIdle]);

    // const handleCardClick = (configureValue) => {
    //     console.log("configureValue:",configureValue)
    //    // alert(configureValue)
    //     navigate(`/home/configurationEdit/${configureValue}`);
    // };

    const handleCardClick = (masterName) => {
        console.log("masterName:", masterName);
    
        if (masterName === 'Usage Log Fields') {
            navigate('/home/UsageLogSetting');
        }else if (masterName === '21CFR Password Config') {
            navigate('/home/Cfr');
        }else if (masterName === 'Change Password') {
            navigate('/home/ChangePassword');
        } else {
            navigate(`/home/configurationEdit/${masterName}`);
        }
    };
    const handleNewClick = () => {
       // console.log("configureValue:",configureValue)
       // alert(configureValue)
      
        navigate(`/home/configurationEdit/${''}`);
    };
    
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredFormulaGroups = formulaGroups.filter(group =>
        group.masterName.toLowerCase().includes(searchQuery.toLowerCase())
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
                                <div className="card card-client" onClick={() => handleCardClick(group.masterName)}>
                                    <div className="checkIcon"><img src={check} alt="check" /></div>
                                    <div className="titles">
                                        <h3 style={{ fontSize: "15px" }}>{group.masterName}</h3>
                                        <p>{group.masterName} </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                       

                       {/* <div className="col-sm-3 mt-5">
                            <Link to="/home/UsageLogSetting" style={{ textDecoration: 'none' }}>
                                <div className="card card-client">
                                    <div className="checkIcon">
                                        <img src={check} alt="check" />
                                    </div>
                                    <div className="titles">
                                        <h3 style={{ fontSize: "15px" }}>Usage Log Fields</h3>
                                        <p>Usage Log Fields</p>
                                    </div>
                                </div>
                            </Link>
                        </div> */}
                        
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Configuration;
