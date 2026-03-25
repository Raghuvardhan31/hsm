import React, { useState } from "react";
import { FaBell, FaUserCircle, FaChevronDown, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

function Header({ onLogout }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="header" style={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white" }}>

            <input
                className="searchBar"
                type="text"
                placeholder="Search properties, owners, tenants..."
            />

            <div className="headerRight">

                <FaBell className="bellIcon" />

                <div
                    className="adminProfile"
                    onClick={() => setOpen(!open)}
                >
                    <FaUserCircle size={32} color="#6b7280" />
                    <div className="adminText">
                        <p>Admin User</p>
                        <span>Super Admin</span>
                    </div>
                    <FaChevronDown size={14} color="#6b7280" style={{ marginLeft: "5px" }} />
                </div>

                {open && (
                    <div className="dropdown">
                        <p style={{ display: 'flex', alignItems: 'center' }}><FaUser style={{ marginRight: "8px" }} /> Profile</p>
                        <p style={{ display: 'flex', alignItems: 'center' }}><FaCog style={{ marginRight: "8px" }} /> Settings</p>
                        <p className="logout" onClick={onLogout} style={{ display: 'flex', alignItems: 'center' }}><FaSignOutAlt style={{ marginRight: "8px" }} /> Logout</p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Header;