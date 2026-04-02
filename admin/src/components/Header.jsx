import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBell, FaUserCircle, FaChevronDown, FaUser, FaCog,
    FaSignOutAlt, FaInfoCircle, FaSearch, FaBuilding, FaHome
} from "react-icons/fa";

function Header({ onLogout }) {
    const navigate = useNavigate();

    // ── Profile / notification state ──────────────────────────────────────
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(() => {
        // Load persisted notifications from localStorage on mount
        try {
            const stored = localStorage.getItem("adminNotifications");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [toast, setToast] = useState(null);
    const wsRef = useRef(null);
    const seenIdsRef = useRef(new Set()); // tracks IDs already added this session

    // ── Search state ──────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allOwners, setAllOwners] = useState([]);
    const [allProperties, setAllProperties] = useState([]);
    const searchRef = useRef(null);

    // ── Fetch owners & properties on mount ────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ownersRes, propsRes] = await Promise.allSettled([
                    fetch("http://192.168.1.28:8000/api/owner-admin/"),
                    fetch("http://192.168.1.28:8000/api/get_all_property_basic_details/"),
                ]);

                if (ownersRes.status === "fulfilled" && ownersRes.value.ok) {
                    const data = await ownersRes.value.json();
                    const owners = (data?.data || []).map(item => ({
                        id: item.id,
                        email: item.email || "",
                        name: item.owner_name || "Unknown Owner",
                        phone: item.phone || "",
                        status: item.status || "pending",
                        type: "owner",
                    }));
                    setAllOwners(owners);
                }

                if (propsRes.status === "fulfilled" && propsRes.value.ok) {
                    const data = await propsRes.value.json();
                    const props = (data?.data || []).map((item, idx) => ({
                        id: idx + 1,
                        email: item.email || "",
                        name: item.name || "Unnamed Property",
                        owner_name: item.owner_name || "",
                        property_type: item.property_type || "",
                        location: item.location || "",
                        type: "property",
                    }));
                    setAllProperties(props);
                }
            } catch (err) {
                console.error("Search data fetch error:", err);
            }
        };

        fetchData();
    }, []);

    // ── Persist notifications to localStorage on every change ─────────────
    useEffect(() => {
        try {
            localStorage.setItem("adminNotifications", JSON.stringify(notifications));
        } catch {
            // storage quota exceeded — ignore
        }
    }, [notifications]);

    // ── Live search filter ────────────────────────────────────────────────
    useEffect(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const matchedOwners = allOwners.filter(o =>
            o.name.toLowerCase().includes(q) ||
            o.email.toLowerCase().includes(q) ||
            o.phone.toLowerCase().includes(q)
        ).slice(0, 5);

        const matchedProps = allProperties.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.owner_name.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.property_type.toLowerCase().includes(q)
        ).slice(0, 5);

        setSearchResults([...matchedOwners, ...matchedProps]);
        setShowDropdown(true);
    }, [searchQuery, allOwners, allProperties]);

    // ── Close dropdown when clicking outside ──────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Navigate on result click ──────────────────────────────────────────
    const handleResultClick = (result) => {
        setSearchQuery("");
        setShowDropdown(false);
        if (result.type === "owner") {
            navigate("/owners", { state: { filter: "All", highlightEmail: result.email } });
        } else {
            navigate("/properties", { state: { highlightEmail: result.email } });
        }
    };

    // ── WebSocket notifications ───────────────────────────────────────────
    useEffect(() => {
        let ws;
        let reconnectTimer;

        const connect = () => {
            ws = new WebSocket("ws://localhost:8000/ws/notifications/");
            wsRef.current = ws;

            ws.onopen = () => console.log("[WS] ✅ Connected");

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "new_registration") {
                    // Build a stable dedup key from message + time
                    const dedupKey = `${data.message}__${data.time}`;
                    if (seenIdsRef.current.has(dedupKey)) return; // already processed
                    seenIdsRef.current.add(dedupKey);

                    const newNotif = {
                        id: Date.now(),
                        message: data.message,
                        time: data.time,
                        type: "new_registration",
                        route: "/owners",
                        routeState: { filter: "pending" },
                        read: false,
                    };
                    setNotifications(prev => {
                        // Secondary safety: don't add if same message+time already in list
                        const alreadyExists = prev.some(
                            n => n.message === data.message && n.time === data.time
                        );
                        if (alreadyExists) return prev;
                        return [newNotif, ...prev];
                    });
                    setToast(data.message);
                    setTimeout(() => setToast(null), 3000);
                    playNotificationSound();
                }
            };

            ws.onerror = (err) => console.error("[WS] ❌ Error:", err);
            ws.onclose = (e) => {
                console.warn("[WS] Disconnected. Retrying in 3s...", e.code);
                reconnectTimer = setTimeout(connect, 3000);
            };
        };

        connect();
        return () => {
            clearTimeout(reconnectTimer);
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.removeItem("adminNotifications");
        seenIdsRef.current.clear();
    };

    // ── Notification sound (Web Audio API — no file needed) ───────────────
    const playNotificationSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523, 659, 784]; // C5, E5, G5 — a pleasant chime chord
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
                gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
                gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + i * 0.12 + 0.6);
            });
        } catch (e) {
            console.warn("Audio not available:", e);
        }
    };

    // ── Navigate on notification click ────────────────────────────────────
    const handleNotifClick = (notif) => {
        // Remove this notification from the list (it's been viewed)
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
        setNotifOpen(false);
        if (notif.route) {
            navigate(notif.route, { state: notif.routeState || {} });
        }
    };

    // ── Status badge colour ───────────────────────────────────────────────
    const getStatusColor = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "active") return { bg: "#dcfce7", text: "#166534" };
        if (s === "pending") return { bg: "#fef3c7", text: "#92400e" };
        if (s === "suspend") return { bg: "#fee2e2", text: "#991b1b" };
        return { bg: "#f3f4f6", text: "#374151" };
    };

    return (
        <div className="header" style={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white" }}>

            {/* ── Search Bar ── */}
            <div ref={searchRef} style={{ position: "relative", width: "380px" }}>
                <div style={{ position: "relative" }}>
                    <FaSearch style={{
                        position: "absolute", left: "12px", top: "50%",
                        transform: "translateY(-50%)", color: "#9ca3af", fontSize: "14px", pointerEvents: "none"
                    }} />
                    <input
                        className="searchBar"
                        type="text"
                        placeholder="Search owners, properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                        style={{ paddingLeft: "36px", width: "100%" }}
                    />
                </div>

                {showDropdown && (
                    <div style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        borderRadius: "14px",
                        boxShadow: "0 12px 40px rgba(76,29,149,0.15)",
                        border: "1px solid #ede9fe",
                        zIndex: 2000,
                        overflow: "hidden",
                        maxHeight: "400px",
                        overflowY: "auto",
                    }}>
                        {searchResults.length === 0 ? (
                            <div style={{
                                padding: "20px", textAlign: "center",
                                color: "#9ca3af", fontSize: "14px"
                            }}>
                                No results found for "<strong>{searchQuery}</strong>"
                            </div>
                        ) : (
                            <>
                                {/* Owner results */}
                                {searchResults.filter(r => r.type === "owner").length > 0 && (
                                    <>
                                        <div style={{
                                            padding: "8px 14px 4px",
                                            fontSize: "11px", fontWeight: "700",
                                            color: "#7c3aed", textTransform: "uppercase",
                                            letterSpacing: "0.06em", background: "#faf5ff"
                                        }}>
                                            👤 Owners
                                        </div>
                                        {searchResults.filter(r => r.type === "owner").map((result) => {
                                            const col = getStatusColor(result.status);
                                            return (
                                                <div
                                                    key={`owner-${result.email}`}
                                                    onClick={() => handleResultClick(result)}
                                                    style={{
                                                        display: "flex", alignItems: "center",
                                                        gap: "12px", padding: "10px 14px",
                                                        cursor: "pointer", transition: "background 0.15s",
                                                        borderBottom: "1px solid #f5f3ff",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                                >
                                                    <div style={{
                                                        width: "36px", height: "36px", borderRadius: "50%",
                                                        background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                                        display: "flex", alignItems: "center",
                                                        justifyContent: "center", flexShrink: 0
                                                    }}>
                                                        <FaUser style={{ color: "#fff", fontSize: "14px" }} />
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {result.name}
                                                        </p>
                                                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {result.email}
                                                        </p>
                                                    </div>
                                                    <span style={{
                                                        padding: "3px 9px", borderRadius: "999px",
                                                        fontSize: "11px", fontWeight: "700",
                                                        background: col.bg, color: col.text,
                                                        textTransform: "capitalize", flexShrink: 0
                                                    }}>{result.status}</span>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}

                                {/* Property results */}
                                {searchResults.filter(r => r.type === "property").length > 0 && (
                                    <>
                                        <div style={{
                                            padding: "8px 14px 4px",
                                            fontSize: "11px", fontWeight: "700",
                                            color: "#2563eb", textTransform: "uppercase",
                                            letterSpacing: "0.06em", background: "#eff6ff"
                                        }}>
                                            🏠 Properties
                                        </div>
                                        {searchResults.filter(r => r.type === "property").map((result) => (
                                            <div
                                                key={`prop-${result.id}`}
                                                onClick={() => handleResultClick(result)}
                                                style={{
                                                    display: "flex", alignItems: "center",
                                                    gap: "12px", padding: "10px 14px",
                                                    cursor: "pointer", transition: "background 0.15s",
                                                    borderBottom: "1px solid #eff6ff",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <div style={{
                                                    width: "36px", height: "36px", borderRadius: "50%",
                                                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                                    display: "flex", alignItems: "center",
                                                    justifyContent: "center", flexShrink: 0
                                                }}>
                                                    <FaHome style={{ color: "#fff", fontSize: "14px" }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {result.name}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {result.owner_name} • {result.property_type} {result.location ? `• ${result.location}` : ""}
                                                    </p>
                                                </div>
                                                <span style={{
                                                    padding: "3px 9px", borderRadius: "999px",
                                                    fontSize: "11px", fontWeight: "700",
                                                    background: "#dbeafe", color: "#1e40af",
                                                    textTransform: "capitalize", flexShrink: 0
                                                }}>{result.property_type}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ── Right side controls ── */}
            <div className="headerRight">

                <div className="bellContainer" onClick={() => setNotifOpen(!notifOpen)}>
                    <FaBell className={`bellIcon${notifications.some(n => !n.read) ? " ringing" : ""}`} />
                    {notifications.length > 0 && (
                        <span className="notificationBadge">{notifications.filter(n => !n.read).length || notifications.length}</span>
                    )}
                </div>

                {notifOpen && (
                    <div className="notificationDropdown">
                        <div className="notificationHeader">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <h4 style={{ margin: 0 }}>Notifications</h4>
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span style={{
                                        background: "#7c3aed", color: "#fff",
                                        fontSize: "10px", fontWeight: "700",
                                        padding: "2px 7px", borderRadius: "999px",
                                    }}>
                                        {notifications.filter(n => !n.read).length} new
                                    </span>
                                )}
                            </div>
                            <span className="clearNotifications" onClick={clearNotifications}>Clear all</span>
                        </div>
                        <div className="notificationList">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="notificationItem"
                                        onClick={() => handleNotifClick(notif)}
                                        style={{
                                            cursor: notif.route ? "pointer" : "default",
                                            background: notif.read ? "transparent" : "#faf5ff",
                                            borderLeft: notif.read ? "3px solid transparent" : "3px solid #7c3aed",
                                            position: "relative",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                            {/* Icon based on type */}
                                            <div style={{
                                                width: "32px", height: "32px", borderRadius: "50%",
                                                background: notif.type === "new_registration"
                                                    ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                                                    : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                                display: "flex", alignItems: "center",
                                                justifyContent: "center", flexShrink: 0, marginTop: "2px",
                                            }}>
                                                <span style={{ fontSize: "14px" }}>
                                                    {notif.type === "new_registration" ? "👤" : "🔔"}
                                                </span>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p className="notificationText" style={{
                                                    fontWeight: notif.read ? "400" : "600",
                                                    color: notif.read ? "#6b7280" : "#111827",
                                                }}>
                                                    {notif.message}
                                                </p>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                                                    <span className="notificationTime">{notif.time}</span>
                                                    {notif.route && (
                                                        <span style={{
                                                            fontSize: "11px", color: "#7c3aed",
                                                            fontWeight: "600", display: "flex",
                                                            alignItems: "center", gap: "4px",
                                                        }}>
                                                            View →
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="emptyNotifications">
                                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔔</div>
                                    <div>No new notifications</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="adminProfile" onClick={() => setOpen(!open)}>
                    <FaUserCircle size={32} color="#6b7280" />
                    <div className="adminText">
                        <p>Admin User</p>
                        <span>Super Admin</span>
                    </div>
                    <FaChevronDown size={14} color="#6b7280" style={{ marginLeft: "5px" }} />
                </div>

                {open && (
                    <div className="dropdown">
                        <p style={{ display: "flex", alignItems: "center" }}><FaUser style={{ marginRight: "8px" }} /> Profile</p>
                        <p style={{ display: "flex", alignItems: "center" }}><FaCog style={{ marginRight: "8px" }} /> Settings</p>
                        <p className="logout" onClick={onLogout} style={{ display: "flex", alignItems: "center" }}><FaSignOutAlt style={{ marginRight: "8px" }} /> Logout</p>
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