import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle, FaChevronDown, FaUser, FaCog, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";

function Header({ onLogout }) {
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        let ws;
        let reconnectTimer;

        const connect = () => {
            console.log("[WS] Attempting to connect...");
            ws = new WebSocket("ws://localhost:8000/ws/notifications/");
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("[WS] ✅ Connected to notification server");
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("[WS] Message received:", data);

                if (data.type === "connected") {
                    console.log("[WS] Server confirmed connection ✅");
                }

                if (data.type === "new_registration") {
                    const newNotif = {
                        id: Date.now(),
                        message: data.message,
                        time: data.time,
                    };
                    setNotifications(prev => [newNotif, ...prev]);
                    setToast(data.message);
                    setTimeout(() => setToast(null), 2000);
                }
            };

            ws.onerror = (error) => {
                console.error("[WS] ❌ Error:", error);
            };

            ws.onclose = (e) => {
                console.warn("[WS] Disconnected. Retrying in 3s...", e.code);
                reconnectTimer = setTimeout(connect, 3000);
            };
        };

        connect();

        // Cleanup on unmount
        return () => {
            clearTimeout(reconnectTimer);
            if (wsRef.current) wsRef.current.close();
        };
    }, []);


    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <div className="header" style={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white" }}>

            <input
                className="searchBar"
                type="text"
                placeholder="Search properties, owners, tenants..."
            />

            <div className="headerRight">

                <div className="bellContainer" onClick={() => setNotifOpen(!notifOpen)}>
                    <FaBell className="bellIcon" />
                    {notifications.length > 0 && (
                        <span className="notificationBadge">{notifications.length}</span>
                    )}
                </div>

                {notifOpen && (
                    <div className="notificationDropdown">
                        <div className="notificationHeader">
                            <h4>Notifications</h4>
                            <span className="clearNotifications" onClick={clearNotifications}>Clear all</span>
                        </div>
                        <div className="notificationList">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <div key={index} className="notificationItem">
                                        <p className="notificationText">{notif.message}</p>
                                        <span className="notificationTime">{notif.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="emptyNotifications">No new notifications</div>
                            )}
                        </div>
                    </div>
                )}

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

            {toast && (
                <div className="toastNotification">
                    <FaInfoCircle />
                    <span>{toast}</span>
                </div>
            )}

        </div>
    );
}

export default Header;