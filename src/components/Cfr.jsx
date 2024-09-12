import React, { useState,useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios"; // Import axios for making HTTP requests
import UserContext from './UserContext';

const Cfr = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    minPasswordLength: "",
    passwordExpiryDays: "",
    promptExpiry: "",
    userLoginAttempts: "",
    autoLogout: "",
    passwordRepetition: "",
    uppercaseRequired: false,
    lowercaseRequired: false,
    numberRequired: false,
    symbolsRequired: false,
  });

  
  useEffect(() => {
    if (!userData || !userData.employeeId) {
      navigate('/');
    }
  }, [userData, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Assuming you have user data from context or other source
    const createdBy = userData?.userRole || 'defaultUsername'; // Replace 'defaultUsername' with actual logic
  
    // Add createdBy to formData
    const updatedFormData = {
      ...formData,
      createdBy, // Append the createdBy field
    };
  
    console.log("Form Data Before Sending:", updatedFormData); // Debugging form data
  
    try {
      const response = await axios.post('http://localhost:58747/api/Settings/Savesettings', updatedFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Response from server:", response.data); // Debugging response
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("There was an error saving the settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };
  

  return (
    <section
      className="full_screen"
      style={{ backgroundColor: "#e9ecef", height: "100vh" }}
    >
      <div className="container-fluid">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb cooseText mb-2">
            <li className="breadcrumb-item active" aria-current="page">
              21CFR Password Configurations
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-12">
            <div
              className="card mt-3"
              style={{ padding: "1.5rem", width: "98%", marginLeft: "5px" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        <b>Minimum Password Length</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="minPasswordLength"
                        value={formData.minPasswordLength}
                        onChange={handleChange}
                        min="8"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        <b>Password Expiry Days</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="passwordExpiryDays"
                        value={formData.passwordExpiryDays}
                        onChange={handleChange}
                        min="5"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        <b>Prompt Expiry to User (Days)</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="promptExpiry"
                        value={formData.promptExpiry}
                        onChange={handleChange}
                        min="5"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* Second row of inputs */}
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        <b>User Login Attempts</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="userLoginAttempts"
                        value={formData.userLoginAttempts}
                        onChange={handleChange}
                        min="3"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        <b>Auto Logout (In Minutes)</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="autoLogout"
                        value={formData.autoLogout}
                        onChange={handleChange}
                        min="1"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        <b>Password Repetition (Times)</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="passwordRepetition"
                        value={formData.passwordRepetition}
                        onChange={handleChange}
                        min="3"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* Checkbox inputs */}
                <div className="row">
                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        name="uppercaseRequired"
                        checked={formData.uppercaseRequired}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        <b>Uppercase Required</b>
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        name="lowercaseRequired"
                        checked={formData.lowercaseRequired}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        <b>Lowercase Required</b>
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                    </div>
                  </div>


                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        name="numberRequired"
                        checked={formData.numberRequired}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        <b>Number Required</b>
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        name="symbolsRequired"
                        checked={formData.symbolsRequired}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        <b>Symbols Required</b>
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="text-end" style={{ marginRight: "20px" }}>
                  <button type="submit " className="btn btn-primary">
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cfr;
