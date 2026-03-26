import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import OwnerDetailsModal from "../components/OwnerDetailsModal";

function Properties({ onLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://192.168.1.31:8000/api/get_all_property_basic_details/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const result = await response.json();

      const formattedProperties = (result.data || []).map((item, index) => ({
        id: index + 1,
        email: item.email,
        property_type: item.property_type,
        image: item.image,
        name: item.name,
        location: item.location,
        owner_name: item.owner_name,
      }));

      setProperties(formattedProperties);
    } catch (err) {
      setError("Failed to fetch properties. Please try again later.");
      console.error("Fetch properties error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main" style={{ padding: 0 }}>
        <Header onLogout={onLogout} />

        <div
          className="properties-page"
          style={{ padding: "30px", minHeight: "auto", background: "transparent" }}
        >
          <div className="page-header">
            <div>
              <h1 className="page-title">Properties</h1>
              <p className="page-subtitle">Manage property listings</p>
            </div>
          </div>

          {loading && (
            <div style={{ padding: "20px", fontSize: "16px" }}>
              Loading properties...
            </div>
          )}

          {error && (
            <div style={{ padding: "20px", color: "red", fontSize: "16px" }}>
              {error}
            </div>
          )}

          {!loading && !error && properties.length === 0 && (
            <div style={{ padding: "20px", fontSize: "16px" }}>
              No properties found.
            </div>
          )}

          {!loading && !error && properties.length > 0 && (
            <div className="properties-grid">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="property-card"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="property-header"
                    style={{
                      height: "180px",
                      backgroundColor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "40px" }}>🏠</span>
                    )}
                  </div>

                  <div className="property-details">
                    <h3 className="property-name">{property.name}</h3>

                    <div className="property-info">
                      <div className="info-item">
                        <span className="info-icon">📍</span>
                        <span>{property.location}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-icon">👤</span>
                        <span>{property.owner_name}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-icon">🏢</span>
                        <span style={{ textTransform: "capitalize" }}>
                          {property.property_type}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="info-icon">✉️</span>
                        <span>{property.email}</span>
                      </div>
                    </div>

                    <div className="property-footer" style={{ marginTop: "16px" }}>
                      <button
                        onClick={() => setSelectedEmail(property.email)}
                        style={{
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <OwnerDetailsModal
            email={selectedEmail}
            onClose={handleCloseDetails}
          />
        </div>
      </div>
    </div>
  );
}

export default Properties;