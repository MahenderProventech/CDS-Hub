import React, { useEffect, useState, useContext } from 'react';
import boardImg from '../../img/board.png';
import logo from '../../img/PROCDSHUB1.svg';
// import provenTechLogo from '../../img/provenLogo.svg';
import http from './../Http';
import UserContext from './../UserContext';
import { useNavigate } from 'react-router-dom';
 
const Login = () => {
    useEffect(() => {
        sessionStorage.clear();
    }, []);
   
    const [state, setState] = useState({
        username: "",
        password: "",
        loginDisable: "disabled",
        loadingClass: "d-none"
    });
 
    const navigate = useNavigate();
    const { setUserData } = useContext(UserContext);
    const [tokenSet, setTokenSet] = useState(false);
 
    useEffect(() => {
        let loginDisable = "";
        if (!state.username || !state.password) {
            loginDisable = "disabled";
        }
 
        setState((prev) => ({
            ...prev,
            loginDisable: loginDisable
        }));
    }, [state.username, state.password]);
 
    useEffect(() => {
        if (tokenSet) {
            navigate("/home", { replace: true });
        }
    }, [tokenSet, navigate]);
 
    const handleChange = (e) => {
        let { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value
        }));
    };
 
    const setItemPromise = (key, value) => {
        sessionStorage.setItem(key, value);
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
                // Handle error if needed
            });
    };
 
    const verifyUser = () => {
        let payload = {
            LoginId: state.username,
            Password: state.password
        };
 
        console.log("payload", payload);
        http.post("/Login/AuthenticateData", payload).then((resp) => {
            if (resp.data.item1) {
                setUserData(resp.data.item2);
                setTokenAndNavigate(resp.data.item2);
            console.log(resp.data.item2);
 
            }
            else{
            alert("Please enter valid details");
            }
        }).catch((err) => {
            console.log(err);
            setState((prev) => ({
                ...prev,
                loadingClass: "d-none"
            }));
            alert("Please enter valid details");
        });
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
                            <input type="email" name='username' className="form-control" value={state.username} id="myInput" placeholder="User ID"
                                onChange={handleChange}
                                autoComplete='off'
                                required />
                        </div>
                        <div className="mb-3">
                            <input type="password" name='password' className="form-control" value={state.password} id="exampleFormControlInput2" placeholder="Password" onChange={handleChange} required />
                        </div>
                        <div className="form-check text-start text-white mb-3">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Remember password?
                            </label>
                        </div>
                        <div>
                            <button className={`btn btn-warning w-100 ${state.loginDisable}`} onClick={verifyUser}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
 
export default Login;