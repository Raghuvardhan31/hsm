import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Owners from "./pages/Owners";
// import Tenants from "./pages/Tenants";
import Properties from "./pages/Properties";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Complaints from "./pages/Complaints";
import Login from "./pages/Login";

import "./App.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initial check (optional, can be expanded for persistent login)
    useEffect(() => {
        const auth = localStorage.getItem("isLoggedIn");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isLoggedIn", "true");
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isLoggedIn");
    };

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route 
                        path="/login" 
                        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
                    />
                    
                    {isAuthenticated ? (
                        <>
                            <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
                            <Route path="/owners" element={<Owners onLogout={handleLogout} />} />
                            {/* <Route path="/tenants" element={<Tenants onLogout={handleLogout} />} /> */}
                            <Route path="/properties" element={<Properties onLogout={handleLogout} />} />
                            <Route path="/bookings" element={<Bookings onLogout={handleLogout} />} />
                            <Route path="/payments" element={<Payments onLogout={handleLogout} />} />
                            <Route path="/complaints" element={<Complaints onLogout={handleLogout} />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;