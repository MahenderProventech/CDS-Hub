import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import http from './Http';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';
import axios from 'axios';
import UserContext from './UserContext';

const ConfigurationEdit = () => {
  const {configId} = useParams();
  const navigate = useNavigate();
  const [formulaGroups, setFormulaGroups] = useState([]);
  const [ConfiguMaster, setConfiguMaster] = useState('');
  const [MasterId, setConfiguMasterId] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [currentView, setCurrentView] = useState(1);
  const { userData } = React.useContext(UserContext);
  const [variableInputs, setVariableInputs] = useState([
    { id: 1, configureId: '',configureValue: '' },
  ]);

  const handleAddVariable = () => {
    const newVariable = {
      id: variableInputs.length + 1,
      configureId:'',
      configureValue: ''
    };
    setVariableInputs([...variableInputs, newVariable]);
  };
  
  
  const handleRemoveVariable = () => {
    if (variableInputs.length > 1) {
      const updatedVariables = variableInputs.slice(0, variableInputs.length - 1);
      setVariableInputs(updatedVariables);
    }
  };

 
const showChildAlert = () => {
  Swal.fire({
    title: '',
    text: 'Saved Successfully.',
    icon: 'info',
    confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
  }).then((result) => {
    navigate(`/home/configuration`);
  });
};

  const submitConfig = async () => {
    const ConfigMasterval = {
      ConfiguMaster,
    };
   
  const ConfigData = variableInputs.map((variableInput,index) => ({
    id:variableInput.id,
    configurationMasterId:MasterId? MasterId : 0,
    configureMaster:ConfiguMaster,
    configureValue: variableInput.configureValue,
    configureId:variableInput.configureId?variableInput.configureId:ConfiguMaster+'00'+(index + 1),
   
  }));
  
  const obj={
    id: MasterId? MasterId : 0,
    masterName: ConfiguMaster,
    createdBy: userData.firstName + '/' + userData.employeeId,
    configurationMasterVal: ConfigData
    // masterName:"ConfigMasterval",
    // configurationMasterVal:"ConfigData"
  }
  console.log("obj", obj);
  setIsSubmitDisabled(true);
  if(ConfiguMaster!=''&& ConfigData!=''){
    
  const resp = await http.post("Configuration/CreateorUpdateConfigureMaster", obj);
  showChildAlert();
  }
  
  setVariableInputs([
    { id: 1, configureId: '',configureValue: '' },
  ]);
  setConfiguMaster('');
  setConfiguMasterId('');
//await fetchData();
}


  useEffect(() => {
    
    const fetchData = async () => {
        try {
            const resp = await http.get(`Configuration/GetConfigurationMastersById?configureValue=${configId}`);
          //  console.log('Fetched Data:', response.data.item2[0]);

            // console.log(response.data.item2[0].formulaVariableInformation)
           // setformulaVariableInformation(response.data.item2[0].formulaVariableInformation);
            if (resp.data) {
                console.log("resp", resp.data.item2);
      setConfiguMaster(resp.data.item2.masterName);
      setConfiguMasterId(resp.data.item2.id);
      setVariableInputs(resp.data.item2.configurationMasterVal);

            } else {
                console.error('Unexpected data format', resp.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  }, [configId]);

  return (
    <section className="full_screen">
      <div style={{ padding: "30px" }}>
        <Row>
          {/* <h6>Group Assign</h6> */}
        </Row>
        <Row>
          <Col sm={3}>
          <h6>{configId} Configuration</h6>

            <input className='variablesInput' value={ConfiguMaster} 
            onChange={(e) => setConfiguMaster(e.target.value)}
            placeholder={`Enter Configure Type`}/>
          </Col>
    </Row>
    <div style={{ padding: "30px" }}></div>
    <table className="mainTable ">
                  <thead>
                    <tr>
                      {/* <th width="40"></th> */}
                      <th width="60" className="">S. No.</th>
                      <th width="300">Id</th>
                      <th width="300">Description</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                      variableInputs.map((variable, index) => {
                        return <tr className="ui-sortable-handle">
                          {/* <td className="text-center" valign="center"></td> */}

                          <td><input type="text" className="text-center" placeholder={`${index + 1}`} readOnly style={{ position: 'relative' }} /></td>

                          <td><input type="text" placeholder={`Enter Id ${index + 1}`}
                            value={variable.configureId}
                            className='variablesInput'
                            onChange={(e) => {
                              const updatedVariables = [...variableInputs];
                              updatedVariables[index].configureId = e.target.value;
                              setVariableInputs(updatedVariables);
                            }} disabled  /></td>
                          <td><input type="text" placeholder={`Enter Description ${index + 1}`}
                            value={variable.configureValue}
                            className='variablesInput'
                            onChange={(e) => {
                              const updatedVariables = [...variableInputs];
                              updatedVariables[index].configureValue = e.target.value;
                              setVariableInputs(updatedVariables);
                            }} /></td>


                         

                        </tr>
                      })
                    }
                  </tbody>
                </table>
                <button className='me-2' onClick={handleAddVariable}>
                  <CiCirclePlus className='circlePlus' />
                </button>
                <button className='me-2' style={{ marginLeft: '1px' }} onClick={handleRemoveVariable}>
                  <CiCircleMinus className='circlePlus' />
                </button>

                <button class="btn btn-primary editBtnConfig"  onClick={submitConfig} >Save</button>
        <Row></Row>
        </div>
    </section>
  );
};

export default ConfigurationEdit
    