import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import http from './Http';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [lastSessionId, setLastSessionId] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(true);
    const sessionIntervalRef = useRef(null); // Ref to track session verification interval
    const navigate = useNavigate();

    // Function to clear the session interval
    const clearSessionInterval = useCallback(() => {
        if (sessionIntervalRef.current) {
            clearInterval(sessionIntervalRef.current);
            sessionIntervalRef.current = null;
        }
    }, []);

    // Logout function that clears session and redirects to login page
    const logout = useCallback(() => {
        clearSessionInterval();
        setIsSessionActive(false); // Prevent further session checks
        setUserData(null);
        setLastSessionId(null);

        Swal.fire({
            title: 'Termination',
            text: 'Session has been Terminated due to another login.',
            icon: 'warning',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
        }).then(() => {
            navigate('/'); // Redirect to login page
        });
    }, [clearSessionInterval, navigate]);

    // Verify session ID to handle multiple logins
    const verifySession = useCallback(async () => {
        if (!userData || !userData.employeeId || !isSessionActive) return; // Stop if no user data or session is inactive

        try {
            const response = await http.get('User/GetListOfUsers');
            const users = response.data?.item2;
            const user = users.find(user => user.employeeId === userData.employeeId);
            const currentSessionId = user?.sessionId;

            if (lastSessionId && currentSessionId !== lastSessionId) {
                // Session has changed, log the user out
                logout();
            } else {
                // Update last session ID if valid and session is still active
                setLastSessionId(currentSessionId);
            }
        } catch (error) {
            console.error('Error verifying session:', error);
        }
    }, [userData, lastSessionId, isSessionActive, logout]);

    // Start the session-checking interval on login
    useEffect(() => {
        if (userData && isSessionActive) {
            // Clear any existing interval to avoid duplication
            clearSessionInterval();

            // Set a new interval to verify session ID every 5 seconds
            sessionIntervalRef.current = setInterval(verifySession, 5000);
        }

        return () => clearSessionInterval(); // Cleanup on component unmount
    }, [verifySession, userData, isSessionActive, clearSessionInterval]);

    // Handle user data update on login (initialize session ID)
    useEffect(() => {
        if (userData) {
            setLastSessionId(userData.sessionId);
            setIsSessionActive(true); // Activate session for verification
        }
    }, [userData]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
