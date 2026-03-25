import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PropertyDetails from "../components/PropertyDetails";
function Properties({ onLogout }) {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Sunrise Apartments",
      location: "Downtown, NYC",
      owner: "James Wilson",
      price: "$1,200/mo",
      status: "Rented",
      color: "#e0e7ff",
      icon: "🏢"
    },
    {
      id: 2,
      name: "Ocean View Villa",
      location: "Miami Beach, FL",
      owner: "Emily Zhang",
      price: "$2,500/mo",
      status: "Available",
      color: "#dbeafe",
      icon: "🏖️"
    },
    {
      id: 3,
      name: "Metro Loft",
      location: "San Francisco, CA",
      owner: "Robert Chen",
      price: "$1,800/mo",
      status: "Rented",
      color: "#d1fae5",
      icon: "🏙️"
    },
    {
      id: 4,
      name: "Green Residency",
      location: "Seattle, WA",
      owner: "Lisa Park",
      price: "$1,100/mo",
      status: "Available",
      color: "#fed7aa",
      icon: "🌳"
    },
    {
      id: 5,
      name: "Skyline Tower",
      location: "Chicago, IL",
      owner: "David Kim",
      price: "$1,500/mo",
      status: "Rented",
      color: "#fce7f3",
      icon: "🏗️"
    },
    {
      id: 6,
      name: "Riverside House",
      location: "Portland, OR",
      owner: "Anna Bell",
      price: "$950/mo",
      status: "Available",
      color: "#e0f2fe",
      icon: "🏡"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    owner: "",
    price: "",
    status: "Available"
  });
  const [selectedProperty, setSelectedProperty] = useState(null);

  const lightColors = [
    "#e0e7ff", "#dbeafe", "#d1fae5", "#fed7aa",
    "#fce7f3", "#e0f2fe", "#f3e8ff", "#fef3c7"
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Rented":
        return { background: "#fee2e2", color: "#991b1b" };
      case "Available":
        return { background: "#d1fae5", color: "#065f46" };
      default:
        return { background: "#f3f4f6", color: "#6b7280" };
    }
  };

  const handleAddProperty = () => {
    setShowAddForm(true);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseDetails = () => {
    setSelectedProperty(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (newProperty.name && newProperty.location && newProperty.owner && newProperty.price) {
      const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];
      const propertyIcons = ["🏢", "🏖️", "🏙️", "🌳", "🏗️", "🏡", "🏘️", "🏠"];
      const randomIcon = propertyIcons[Math.floor(Math.random() * propertyIcons.length)];

      const property = {
        id: properties.length + 1,
        ...newProperty,
        color: randomColor,
        icon: randomIcon
      };

      setProperties([...properties, property]);
      setNewProperty({
        name: "",
        location: "",
        owner: "",
        price: "",
        status: "Available"
      });
      setShowAddForm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewProperty({
      name: "",
      location: "",
      owner: "",
      price: "",
      status: "Available"
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main" style={{ padding: 0 }}>
        {/* Top Header */}
        <Header onLogout={onLogout} />

        {/* Properties Content */}
        <div className="properties-page" style={{ padding: "30px", minHeight: "auto", background: "transparent" }}>
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Properties</h1>
              <p className="page-subtitle">Manage property listings</p>
            </div>
            <button
              onClick={handleAddProperty}
              className="btn-primary"
            >
              <span className="btn-icon">+</span>
              Add Property
            </button>
          </div>

          {/* Add Property Form Modal */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="modal-title">Add New Property</h2>

                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label className="form-label">Property Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProperty.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Sunset Apartments"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newProperty.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Downtown, NYC"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Owner Name</label>
                    <input
                      type="text"
                      name="owner"
                      value={newProperty.owner}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Rent</label>
                    <input
                      type="text"
                      name="price"
                      value={newProperty.price}
                      onChange={handleInputChange}
                      placeholder="e.g., $1,500/mo"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={newProperty.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Available">Available</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={handleCancelAdd}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Add Property
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="properties-grid">
            {/* Property Cards */}
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                className="property-card"
              >
                {/* Colored Header */}
                <div
                  className="property-header"
                  style={{ backgroundColor: property.color }}
                >
                  <div className="property-icon">
                    {property.icon}
                  </div>
                </div>

                {/* Property Details */}
                <div className="property-details">
                  <h3 className="property-name">{property.name}</h3>

                  <div className="property-info">
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span>{property.location}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-icon">👤</span>
                      <span>{property.owner}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-icon">💰</span>
                      <span>{property.price}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="property-footer">
                    <span
                      className="status-badge"
                      style={getStatusStyle(property.status)}
                    >
                      {property.status}
                    </span>

                    <span className="view-details">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Property Card */}
            <div
              onClick={handleAddProperty}
              className="add-property-card"
            >
              <div className="add-icon">+</div>
              <h3 className="add-title">Add New Property</h3>
              <p className="add-subtitle">Create a new property listing</p>
            </div>
          </div>

          {/* Property Details Modal */}
          {selectedProperty && (
            <PropertyDetails
              property={selectedProperty}
              onClose={handleCloseDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Properties;
