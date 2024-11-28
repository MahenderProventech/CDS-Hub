import React, { useEffect, useState, useContext } from 'react';
import boardImg from '../../img/board.png';
import logo from '../../img/PROCDSHUB1.svg';
import http from './../Http';
import UserContext from './../UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add axios import if not already included
import { Modal, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Login = () => {
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const [state, setState] = useState({
        username: "",
        password: "",
        loginDisable: "disabled",
        loadingClass: "d-none",
    });
    const [tokenSet, setTokenSet] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [changePasswordData, setChangePasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        newPassword: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = (setter) => {
        setter(prev => !prev);
    };

    const [errors, setErrors] = useState({});
    const [previousPasswords, setPreviousPasswords] = useState([]);
    const [apiSettings, setApiSettings] = useState({});
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();

const [showErrorModal, setShowErrorModal] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");

// const showModal = (title, message) => {
//     setModalMessage(message);
//     if (title === "Error") {
//         setShowErrorModal(true);
//     } else if (title === "Success") {
//         setShowSuccessModal(true);
//     }
// };

const handleForgotPassword = () => {
    // Navigate to the forgot password page
    navigate('/forgotpassword');
};

    useEffect(() => {
        let loginDisable = "";
        if (!state.username || !state.password) {
            loginDisable = "disabled";
        }

        setState((prev) => ({
            ...prev,
            loginDisable: loginDisable,
        }));
    }, [state.username, state.password]);

    useEffect(() => {
        if (tokenSet) {
            navigate("/home", { replace: true });
        }
    }, [tokenSet, navigate]);

    // Fetch API settings and previous passwords for the employee
    useEffect(() => {
        http.get('Settings/Savesettings')
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setApiSettings(response.data[0]);
                }
            })
            .catch(error => console.error("There was an error fetching settings:", error));

        if (userData?.employeeId) {
            http.get(`User/GetAllChangePasswordRequests`, {
                params: { employeeId: userData.employeeId }
            })
                .then(response => setPreviousPasswords(response.data))
                .catch(error => console.error("There was an error fetching previous passwords:", error));
        }
    }, [userData]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const setItemPromise = (key, value) => {
        sessionStorage.setItem(key, value);
    };

    const showAlert = (text) => {
        Swal.fire({
            title: '',
            text: text,

            icon: 'info',
            confirmButtonText: 'Ok',
            //   cancelButtonText: 'Close',
            //   showCancelButton: true,
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        })
    };
  
    const setTokenAndNavigate = (data) => {
        const usernamePromise = setItemPromise("username", data.username);
        const userrolePromise = setItemPromise("userrole", data.userrole);
        const departmentPromise = setItemPromise("department", data.department);
        const tokenPromise = setItemPromise("token", data.token);

        Promise.all([usernamePromise, userrolePromise, departmentPromise, tokenPromise])
            .then(() => {
                setTokenSet(true);
                navigate("/home/Select", { replace: true });
            })
            .catch((error) => {
                console.error('Error setting session storage:', error);
            });
    };

    const verifyUser = async () => {
        try {
            // Fetch users
            const usersResponse = await http.get('User/GetListOfUsers');
            
            // Log the response to verify its structure
            console.log(usersResponse.data);
            
            // Destructure response to get user data
            const { item1, item2 } = usersResponse.data;
    
            if (!item1) {
                Swal.fire("Error", "Unable to fetch users.","Error");
                return;
            }
    
            const users = Array.isArray(item2) ? item2 : [];
    
            if (users.length === 0) {
                Swal.fire("info", "No users found.","info");
                return;
            }
    
            // Find the user with the provided username
            const user = users.find(u => u.employeeId === state.username);
            const expiryDate = new Date(user.expiryDate); 
            console.log(expiryDate)
            const today = new Date();
    
            if (expiryDate < today) {
                setShowPasswordModal(true);
                return;
            }

            if (user) {
                // Check user status
                if (!user.isActive) {
                    Swal.fire('info', "User is locked. Please contact admin.","info");
                    return;
                }
    
                // Proceed with authentication
                const payload = {
                    LoginId: state.username,
                    Password: state.password,
                };
    
                const authResponse = await http.post("Login/AuthenticateData", payload);
    
                if (authResponse.data.item1) {
                    const userData = authResponse.data.item2;
                    setUserData(userData);
                    checkForPasswordChange(userData);
                } else {
                    Swal.fire("info", "Invalid username or password.","info");
                }
            } else {
                Swal.fire("info", "User does not exist.","info");
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire("Error", "An error occurred. Please try again.","Error");
        } finally {
            setState(prev => ({
                ...prev,
                loadingClass: "d-none",
            }));
        }
    };
    

    const checkForPasswordChange = (userData) => {
        const employeeId = userData.employeeId;
    
        http.get(`User/GetAllChangePasswordRequests?employeeId=${employeeId}`)
            .then((response) => {
                const changeRequests = response.data;
                // console.log("in check",changeRequests.length)
                // const latestRequest = changeRequests[changeRequests.length - 1];
                // console.log("latestRequest",latestRequest)
                if (changeRequests.length > 0) {
                    const latestRequest = changeRequests[changeRequests.length - 1];
    
                    // Check if OldPassword is exactly null
                    if (latestRequest.oldPassword === "") {
                        setShowPasswordModal(true);
                    } else {
                        setTokenAndNavigate(userData);
                    }
                } else {
                    setTokenAndNavigate(userData);
                }
            })
            .catch((error) => {
                console.error('Error fetching change password requests:', error);
            });
    };
    

    const validateForm = () => {
        const { oldPassword, newPassword, confirmPassword } = changePasswordData;
        const newErrors = {};

        if (newPassword.length < (apiSettings?.minPasswordLength || 8)) {
            newErrors.newPassword = `Password must be at least ${apiSettings?.minPasswordLength || 8} characters long`;
        }

         // Get the most recent passwords
    const sortedPasswords = [...previousPasswords].sort((a, b) => new Date(b.changedDate) - new Date(a.changedDate));
    const recentPasswords = sortedPasswords.slice(0, apiSettings?.passwordRepetition || 0).map(p => p.newPassword);

    // Check for password reuse
    if (recentPasswords.includes(newPassword)) {
        newErrors.newPassword = `You cannot use one of your last ${apiSettings?.passwordRepetition} passwords`;
    }

        if ((apiSettings?.uppercaseRequired === true || apiSettings?.uppercaseRequired === 1) && !/[A-Z]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one uppercase letter";
        }

        if ((apiSettings?.lowercaseRequired === true || apiSettings?.lowercaseRequired === 1) && !/[a-z]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one lowercase letter";
        }

        if ((apiSettings?.numberRequired === true || apiSettings?.numberRequired === 1) && !/[0-9]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one number";
        }

        if ((apiSettings?.symbolsRequired === true || apiSettings?.symbolsRequired === 1) && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one symbol";
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordChange = async () => {
        // Validate the form before proceeding
        if (!validateForm()) return;
   
        if (!state.username || !changePasswordData.oldPassword || !changePasswordData.newPassword) {
            showAlert("Please fill in all fields.");
            return;
        }
   
        try {
            // Fetch the most recent password
            const response = await http.get(`User/GetAllChangePasswordRequests?employeeId=${state.username}`);
            const previousPasswords = response.data || [];
            console.log("Previous passwords:", previousPasswords);
   
            const mostRecentPassword = previousPasswords.length > 0
                ? previousPasswords[previousPasswords.length - 1].newPassword
                : null;
   
            console.log("Most recent password:", mostRecentPassword);
   
            // Validate old password
            if (changePasswordData.oldPassword !== mostRecentPassword) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    oldPassword: 'Old password is incorrect'
                }));
                showAlert("Old password is incorrect");
                return;
            }
   
            // Validate new password
            if (changePasswordData.newPassword === changePasswordData.oldPassword) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    newPassword: 'New password cannot be the same as old password'
                }));
                return;
            }
   
            // Prepare payload
            const payload = {
                employeeId: state.username,
                oldPassword: changePasswordData.oldPassword,
                newPassword: changePasswordData.newPassword,
                confirmPassword: changePasswordData.confirmPassword
            };
   
            // Submit password change request
            const changePasswordResponse = await http.post("User/ChangeOldPassword", payload);
            console.log("Password change response:", changePasswordResponse);
   
            showAlert("Password changed successfully.");
            setShowPasswordModal(false);
            navigate("/", { replace: true });
   
        } catch (error) {
            console.error("Error during password change:", error.response || error);
            showAlert("Failed to change password. Please check the entered information.");
        }
    };
 
    
    

        
    

    return (
        <section className="login">
            <div className="slider">
                <div className="mainBoard">
                    <img src={boardImg} alt="Board" />
                </div>
            </div>
            <div className="l_m">
                <div className="f_m">
                    <img src={logo} alt="Logo" width="200px" />
                    <p className="my-3 px-3 text-white">
                        Chromatography Data System helps organization to enter the usage details of each & every equipment or instrument in a GMP manufacturing environment.
                    </p>
                    <div>
                        <div className="mb-3">
                            <input
                                type="email"
                                name="username"
                                className="form-control"
                                value={state.username}
                                id="myInput"
                                placeholder="User ID"
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                            type={passwordVisible ? 'text' : 'password'}
                                // type="password"
                                name="password"
                                className="form-control"
                                value={state.password}
                                id="exampleFormControlInput2"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                            <span
                            onClick={() => togglePasswordVisibility(setPasswordVisible)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-20%)',
                                cursor: 'pointer',
                                fontSize: '1.0rem'
                            }}
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        </div>
                        <div className="forgot-password-link text-start">
                                <Button variant="link" className="btn-transparent text-white" onClick={handleForgotPassword}>
                                    Forgot Password
                                </Button>
                            </div>
                        <div>
                            <button className={`btn btn-warning w-100 ${state.loginDisable}`} onClick={verifyUser}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
{/* Success Modal */}
<Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
    </Modal.Header>
    <Modal.Body>{modalMessage}</Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Close
        </Button>
    </Modal.Footer>
</Modal>

{/* Error Modal */}
<Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
    </Modal.Header>
    <Modal.Body>{modalMessage}</Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
        </Button>
    </Modal.Footer>
</Modal>
            {/* Change Password Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="mb-3" style={{ position: 'relative' }}>
                        <label htmlFor="oldPassword" className="form-label">Old Password</label>
                        <input
                            type={oldPasswordVisible ? 'text' : 'password'}
                            className="form-control"
                            id="oldPassword"
                            value={changePasswordData.oldPassword}
                            onChange={(e) => setChangePasswordData({ ...changePasswordData, oldPassword: e.target.value })}
                        />
                        <span
                            onClick={() => togglePasswordVisibility(setOldPasswordVisible)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-0%)',
                                cursor: 'pointer',
                                fontSize: '1.0rem'
                            }}
                        >
                            {oldPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {errors.oldPassword && <div className="text-danger">{errors.oldPassword}</div>}
                    </div>

                    <div className="mb-3" style={{ position: 'relative' }}>
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                            type={newPasswordVisible ? 'text' : 'password'}
                            className="form-control"
                            id="newPassword"
                            value={changePasswordData.newPassword}
                            onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })}
                        />
                        <span
                            onClick={() => togglePasswordVisibility(setNewPasswordVisible)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-0%)',
                                cursor: 'pointer',
                                fontSize: '1.0rem'
                            }}
                        >
                            {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
                    </div>

                    <div className="mb-3" style={{ position: 'relative' }}>
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            className="form-control"
                            id="confirmPassword"
                            value={changePasswordData.confirmPassword}
                            onChange={(e) => setChangePasswordData({ ...changePasswordData, confirmPassword: e.target.value })}
                        />
                        <span
                            onClick={() => togglePasswordVisibility(setConfirmPasswordVisible)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-0%)',
                                cursor: 'pointer',
                                fontSize: '1.0rem'
                            }}
                        >
                            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handlePasswordChange}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
        </section>
    );
};

export default Login;
