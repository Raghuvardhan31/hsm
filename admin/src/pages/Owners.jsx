import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import OwnerDetailsModal from "../components/OwnerDetailsModal";

function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://192.168.1.31:8000/api/owner-admin/");
      const result = await response.json();

      if (response.ok && result?.data) {
        const formattedData = result.data.map((item, index) => ({
          id: item.id || index + 1,
          name: item.owner_name || "No Name",
          phone: item.phone || "N/A",
          email: item.email || "N/A",
          property: item.property_name || "Property",
          status: item.status || "pending",
        }));

        setOwners(formattedData);
      } else {
        setOwners([]);
        setError(result?.error || "Failed to fetch owner data");
      }
    } catch (err) {
      console.error("Fetch owners error:", err);
      setOwners([]);
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const updateOwnerStatus = async (email, newStatus) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(
        `http://192.168.1.31:8000/api/owner-status/${cleanEmail}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result?.error || "Failed to update status");
        return;
      }

      setOwners((prev) =>
        prev.map((owner) =>
          owner.email.toLowerCase() === cleanEmail
            ? { ...owner, status: newStatus }
            : owner
        )
      );

      alert("Status updated successfully");
    } catch (err) {
      console.error("Status update error:", err);
      alert("Server not reachable");
    }
  };

  const closeModal = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main" style={{ padding: 0 }}>
        <Header />

        <div className="tenants-container" style={{ padding: "30px" }}>
          <div className="tenants-header">
            <div>
              <h2 style={{ color: "#4c1d95", marginBottom: "6px" }}>Owners</h2>
              <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                Manage owners and properties
              </p>
            </div>
          </div>

          {loading ? (
            <p>Loading owners...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <table className="owners-table" style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Owner</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Property</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {owners.length > 0 ? (
                  owners.map((owner) => (
                    <tr key={owner.id}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={avatarStyle}>
                            {owner.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <span>{owner.name}</span>
                        </div>
                      </td>

                      <td style={tdStyle}>{owner.phone}</td>
                      <td style={tdStyle}>{owner.email}</td>
                      <td style={tdStyle}>{owner.property}</td>

                      <td style={tdStyle}>
                        <span style={getStatusBadgeStyle(owner.status)}>
                          {owner.status}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            style={approveBtn}
                            onClick={() => updateOwnerStatus(owner.email, "active")}
                          >
                            Approve
                          </button>

                          <button
                            style={suspendBtn}
                            onClick={() => updateOwnerStatus(owner.email, "suspend")}
                          >
                            Suspend
                          </button>

                          <button
                            style={viewBtn}
                            onClick={() => setSelectedEmail(owner.email)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                      No owners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <OwnerDetailsModal email={selectedEmail} onClose={closeModal} />
      </div>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#ffffff",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  background: "#f3f4f6",
  color: "#111827",
  fontWeight: "700",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #f1f5f9",
  color: "#374151",
  verticalAlign: "middle",
};

const avatarStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "14px",
};

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const suspendBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const viewBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const getStatusBadgeStyle = (status) => {
  const s = (status || "").toLowerCase();

  if (s === "active") {
    return {
      background: "#dcfce7",
      color: "#166534",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "capitalize",
    };
  }

  if (s === "pending") {
    return {
      background: "#fef3c7",
      color: "#92400e",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "capitalize",
    };
  }

  return {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  };
};

export default Owners;