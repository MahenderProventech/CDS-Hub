import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import UserContext from './UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiSettings, setApiSettings] = useState(null);
  const [previousPasswords, setPreviousPasswords] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (!userData || !userData.employeeId) {
      navigate('/');
    }

    // Fetch API settings on component mount
    axios.get('http://localhost:58747/api/Settings/Savesettings')
      .then(response => {
        if (response.data && response.data.length > 0) {
          setApiSettings(response.data[0]); // Assuming the API returns an array, take the first element
          console.log("API Settings fetched: ", response.data[0]); 
        }
      })
      .catch(error => {
        console.error("There was an error fetching settings:", error);
      });

    // Fetch previous passwords for repetition check
    axios.get(`http://localhost:58747/api/User/GetAllChangePasswordRequests`, {
        params: { employeeId: userData.employeeId } // Pass employeeId as query parameter
      })
      .then(response => {
        setPreviousPasswords(response.data); // Assume this API returns an array of previous passwords
        console.log("Previous passwords fetched: ", response.data);
      })
      .catch(error => {
        console.error("There was an error fetching previous passwords:", error);
      });
  }, [userData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { oldPassword, newPassword, confirmPassword } = formData;
    const newErrors = {};

    // Minimum password length check
    if (newPassword.length < (apiSettings?.minPasswordLength || 8)) {
      newErrors.newPassword = `Password must be at least ${apiSettings?.minPasswordLength || 8} characters long`;
    }

    // Password repetition check
    if (apiSettings?.passwordRepetition && previousPasswords.length > 0) {
      const repeatedPasswords = previousPasswords.slice(0, apiSettings.passwordRepetition).map(p => p.newPassword);
      if (repeatedPasswords.includes(newPassword)) {
        newErrors.newPassword = `You cannot use one of your last ${apiSettings.passwordRepetition} passwords`;
      }
    }

    // Uppercase check
    if ((apiSettings?.uppercaseRequired === true || apiSettings?.uppercaseRequired === 1) && !/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
    }

    // Lowercase check
    if ((apiSettings?.lowercaseRequired === true || apiSettings?.lowercaseRequired === 1) && !/[a-z]/.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one lowercase letter";
    }

    // Number check
    if ((apiSettings?.numberRequired === true || apiSettings?.numberRequired === 1) && !/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    }

    // Symbols check
    if ((apiSettings?.symbolsRequired === true || apiSettings?.symbolsRequired === 1) && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one symbol";
    }

    // Password match check
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Prepare the data to be sent in the POST request
      const requestData = {
        employeeId: userData?.employeeId || '',  // Ensure this is a string or the correct type
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };

      // Make the POST request
      const response = await axios.post('http://localhost:58747/api/User/ChangeOldPassword', requestData, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

      // Handle the response
      const { data, status } = response;  // Destructure directly from response
      if (status === 200) {
        setModal({ show: true, type: "success", message: data || "Password changed successfully!" });
      } else {
        setModal({ show: true, type: "error", message: data || "An error occurred. Please try again." });
      }
    } catch (error) {
      console.error("There was an error changing the password:", error);
      const errorMessage = error.response?.data || "Failed to change password. Please try again.";
      setModal({ show: true, type: "error", message: errorMessage });
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, show: false });
  };

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  
  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
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
              Change Password
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
  <div className="mb-3 position-relative">
    <label className="form-label">
      <b>Old Password</b>
      <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type={showPasswords.oldPassword ? "text" : "password"}
      name="oldPassword"
      value={formData.oldPassword}
      onChange={handleChange}
      required
      className="form-control"
    />
    <span
      onClick={() => togglePasswordVisibility('oldPassword')}
      style={{ position: "absolute", right: 10, top: 35, cursor: "pointer" }}
    >
      {showPasswords.oldPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
    {errors.oldPassword && <div className="text-danger">{errors.oldPassword}</div>}
  </div>
</div>

<div className="col-lg-4 col-md-6 col-sm-12">
  <div className="mb-3 position-relative">
    <label className="form-label">
      <b>New Password</b>
      <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type={showPasswords.newPassword ? "text" : "password"}
      name="newPassword"
      value={formData.newPassword}
      onChange={handleChange}
      required
      className="form-control"
    />
    <span
      onClick={() => togglePasswordVisibility('newPassword')}
      style={{ position: "absolute", right: 10, top: 35, cursor: "pointer" }}
    >
      {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
    {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
  </div>
</div>

<div className="col-lg-4 col-md-6 col-sm-12">
  <div className="mb-3 position-relative">
    <label className="form-label">
      <b>Confirm Password</b>
      <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type={showPasswords.confirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
      className="form-control"
    />
    <span
      onClick={() => togglePasswordVisibility('confirmPassword')}
      style={{ position: "absolute", right: 10, top: 35, cursor: "pointer" }}
    >
      {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
  </div>
</div>

                </div>
                <div className="text-end" style={{ marginRight: "20px" }}>
                  <button type="submit" className="btn btn-primary" style={{ margin: "10px" }}>
                    Submit
                  </button>
                  <button type="reset" className="btn btn-danger" onClick={() => setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })}>
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying messages */}
<div className={`modal fade ${modal.show ? "show" : ""}`} style={{ display: modal.show ? "block" : "none" }} role="dialog" aria-labelledby="modalTitle" aria-hidden={modal.show ? "false" : "true"} inert={modal.show ? false : true}>
  <div className="modal-dialog" role="document">
    <div className={`modal-content ${modal.type === "success" ? "bg-success text-black" : "bg-danger text-black"}`}>
      <div className="modal-header">
        <h5 className="modal-title" id="modalTitle">{modal.type === "success" ? "Success" : "Error"}</h5>
      </div>
      <div className="modal-body">
        {modal.message}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-light" onClick={handleCloseModal}>Close</button>
      </div>
    </div>
  </div>
</div>

    </section>
  );
};

export default ChangePassword;
