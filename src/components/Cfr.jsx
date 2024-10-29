import React, { useState,useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios"; // Import axios for making HTTP requests
import UserContext from './UserContext';
import Swal from "sweetalert2";
import http from "./Http";


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
    } else {
    fetchSettingsData();
  }
}, [userData, navigate]);

const fetchSettingsData = async () => {
  try {
    const response = await http.get('Settings/Savesettings');
    if (response.data && response.data.length > 0) {
      const settingsData = response.data[0]; // Assuming you're only fetching one record
      setFormData({
        minPasswordLength: settingsData.minPasswordLength,
        passwordExpiryDays: settingsData.passwordExpiryDays,
        promptExpiry: settingsData.promptExpiry,
        userLoginAttempts: settingsData.userLoginAttempts,
        autoLogout: settingsData.autoLogout,
        passwordRepetition: settingsData.passwordRepetition,
        uppercaseRequired: settingsData.uppercaseRequired,
        lowercaseRequired: settingsData.lowercaseRequired,
        numberRequired: settingsData.numberRequired,
        symbolsRequired: settingsData.symbolsRequired,
      });
    }
  } catch (error) {
    console.error("Error fetching settings data:", error);
    Swal.fire("Error", "Unable to fetch settings data", "error");
  }
};



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
  
    // Show SweetAlert to ask for e-signature (password and comments)
  
    const { value: swalData } = await Swal.fire({
  
      title: 'E-signature Required',
  
      html: `
  <div style="display: flex; flex-direction: column; align-items: center;">
  <input type="text" value='${userData.employeeId}' disabled class="swal2-input" placeholder="Username" style="padding: 5px; width: 90%; font-size: 12px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc;">
  <input type="password" id="password" class="swal2-input" placeholder="Password" style="padding: 5px; width: 90%; font-size: 12px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #ccc;">
  <textarea id="swal-comments" class="swal2-input" placeholder="Comments" style="padding: 5px; width: 90%; margin-top: 10px; font-size: 12px; height: 80px; border-radius: 4px; border: 1px solid #ccc;"></textarea>
  </div>
  
      `,
  
      focusConfirm: false,
  
      preConfirm: () => {
  
        const password = Swal.getPopup().querySelector('#password').value;
  
        const swalComments = Swal.getPopup().querySelector('#swal-comments').value;
   
        if (!password) {
  
          Swal.showValidationMessage('Please enter your password');
  
          return false;
  
        }
  
        if (!swalComments) {
  
          Swal.showValidationMessage('Please add comments');
  
          return false;
  
        }
  
        return { password, swalComments };
  
      },
  
      showCancelButton: true,
  
      cancelButtonText: 'Cancel',
  
      confirmButtonText: 'Submit',
  
    });
   
    // If swalData is provided, proceed with form submission
  
    if (swalData) {
  
      const { password, swalComments } = swalData;
   
      try {
  
        // Verify the e-signature by authenticating with the password
  
        const authPayload = {
  
          LoginId: userData.employeeId,
  
          Password: password,
  
        };
   
        const authResponse = await http.post("/Login/AuthenticateData", authPayload);
  
        if (authResponse.data.item1) {
  
          const createdBy = `${userData.firstName}/${userData.employeeId}`;
  
          // Merge the original formData with SweetAlert data
  
          const updatedFormData = {
  
            ...formData, // this is the actual form data you want to submit
  
            createdBy,
  
            comments: swalComments, // or swalData.swalComments
  
          };
   
          // Proceed with form submission if authentication is successful
  
          const response = await http.post('Settings/Savesettings', updatedFormData, {
  
            headers: {
  
              'Content-Type': 'application/json',
  
            },
  
          });
   
          Swal.fire('Success', 'Settings saved successfully!', 'success');
  
        } else {
  
          Swal.fire('Authentication failed', 'Invalid password.', 'error');
  
        }
  
      } catch (error) {
  
        console.error("There was an error saving the settings:", error);
  
        Swal.fire("Failed to save settings. Please try again.");
  
      }
  
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
            System Policies Configurations      </li>
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
