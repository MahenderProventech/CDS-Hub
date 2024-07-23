import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate()
    useEffect(() => {
        if (!sessionStorage.getItem("username")) {
            sessionStorage.clear();
            navigate("/Login", { replace: true })
        }
    }, [])
    return children
}

export default PrivateRoute