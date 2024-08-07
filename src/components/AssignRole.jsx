import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import http from './Http';

const AssignRole = () => {
  const [selectedFormula, setSelectedFormula] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [roleAssignments, setRoleAssignments] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const navigate = useNavigate();

  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Role Is Created Successfully.',
      icon: 'info',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      showCancelButton: true,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/home/assignRole");
      }
    });
  };

  const handleSelectFormula = (event) => {
    const value = event.target.value;
    setSelectedFormula(value);
    setIsSubmitDisabled(!value || !selectedPlant);
  };

  const handleSelectRole = (event) => {
    const value = event.target.value;
    setSelectedRole(value);
    setIsSubmitDisabled(!selectedFormula || !value || !selectedPlant);
  };

  const handleSelectPlant = (event) => {
    const value = event.target.value;
    setSelectedPlant(value);
    setIsSubmitDisabled(!selectedFormula || !value);
  };

  const fetchRoleAssignments = async () => {
    try {
      const response = await http.get("Formulas/GetMappedRoles");
      console.log('Fetched role assignments:', response.data);
      setRoleAssignments(response.data.item2 || []);
    } catch (error) {
      console.error('Error fetching role assignments:', error.response ? error.response.data : error.message);
    }
  };

  const submitRole = async () => {
    const obj = {
      FormulaId: selectedFormula,
      RoleID: "QA",
      PlantName: selectedPlant
    };

    try {
      console.log("obj", obj);
      const response = await http.post("Formulas/UpdateRoleFormulaMapping", obj, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);

      // Fetch the updated role assignments
      await fetchRoleAssignments();

      showAlert();
      setIsSubmitDisabled(true);

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Error',
        text: 'Failed to assign role. Please check the input and try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
        cancelButtonText: 'Close',

      });
    }
  };

  useEffect(() => {
    http.get("Formulas/GetDashboard").then((resp) => {
      let rawData = [...resp.data.item2.dashboardGridData];

      // Sorting data by descending order
      rawData.sort((a, b) => {
        return new Date(b.CreatedDateTime) - new Date(a.CreatedDateTime);
      });

      setRowData(rawData);
    }).catch((err) => {
      console.log("GetDashboard err", err);
    });

    // Fetch the initial role assignments
    fetchRoleAssignments();
  }, []);

  return (
    <section className="full_screen">
      <div style={{ padding: "30px" }}>
        <Row>
          <h6>Role Assign</h6>
        </Row>
        <Row>
          <Col sm={4}>
            <select
              className="groupByName1"
              value={selectedFormula}
              onChange={handleSelectFormula}
            >
              <option value="" disabled>
                Select Formula
              </option>
              {rowData.map((each) => (
                <option key={each.formulaId} value={each.formulaId}>
                  {each.formulaId}
                </option>
              ))}
            </select>
          </Col>
          <Col sm={4}>
            <select 
              className="groupByName1" 
              value={selectedPlant} 
              onChange={handleSelectPlant}
            >
              <option value="" disabled>
                Select Plant
              </option>
              <option value="Plant1">Plant1</option>
              <option value="Plant2">Plant2</option>
              <option value="Plant3">Plant3</option>
            </select>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <button
              id="submit-btn"
              className="btn btn-primary mt-4"
              onClick={submitRole}
              disabled={isSubmitDisabled}
              style={{ backgroundColor: '#463E96', borderColor: '#463E96' }}>
              Submit
            </button>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <h6 className="mt-5">Assigned Roles</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Formula</th>
                  <th>Role</th>
                  <th>Plant</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(roleAssignments) && roleAssignments.length > 0 ? (
                  roleAssignments.map((assignment, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{assignment.formulaId}</td>
                      <td>{assignment.roleID}</td>
                      <td>{assignment.plantName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No role assignments found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default AssignRole;
