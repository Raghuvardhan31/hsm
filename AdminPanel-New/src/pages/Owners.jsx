// import React, { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";

// function Owners() {
//   const [tenants, setTenants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [showVerification, setShowVerification] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchTenants();
//   }, []);

//   const fetchTenants = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch("http://192.168.1.15:8000/api/owner-admin/");
//       const result = await response.json();

//       if (response.ok && result?.data) {
//         const formattedData = result.data.map((item, index) => ({
//           id: item.id || index + 1,
//           name: item.owner_name || "No Name",
//           phone: item.phone || "N/A",
//           email: item.email || "N/A",
//           property: item.property_name || "Default Property",
//           room: item.room || "A-101",
//           rent: item.rent || "$1,200",
//           checkIn: item.check_in || "Dec 1, 2024",
//           status: item.status || "Pending",
          
//           idProof: item.id_proof || "No ID Proof",
//           rentalAgreement: item.rental_agreement || "No Agreement",
//           photo:
//             item.photo ||
//             `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
//               item.owner_name || "Tenant"
//             )}`,
//           emergencyContact:
//             item.emergency_contact || "No emergency contact available",
//         }));

//         setTenants(formattedData);
//       } else {
//         setTenants([]);
//         setError("Failed to fetch tenant data");
//         console.log("Error:", result);
//       }
//     } catch (error) {
//       setTenants([]);
//       setError("Fetch error. Server not reachable.");
//       console.log("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setSelectedTenant(null);
//     setShowVerification(false);
//   };

//   return (
//     <div className="dashboard">
//       <Sidebar />

//       <div className="main" style={{ padding: 0 }}>
//         <Header />

//         <div className="tenants-container" style={{ padding: "30px" }}>
//           <div className="tenants-header">
//             <div>
//               <h2 style={{ color: "#4c1d95" }}>Owners</h2>
//               <p style={{ color: "#c084fc", marginBottom: "20px" }}>
//                 Manage Owners and leases
//               </p>
//             </div>

//             <button className="add-tenant">+ Add Owners</button>
//           </div>

//           {loading ? (
//             <p>Loading Owners...</p>
//           ) : error ? (
//             <p style={{ color: "red" }}>{error}</p>
//           ) : (
//             <table className="tenants-table">
//               <thead>
//                 <tr>
//                   <th>Owner</th>
//                   <th>Phone</th>
//                   <th>Property</th>
//                   <th>Rent</th>
//                   <th>Check-in</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {tenants.length > 0 ? (
//                   tenants.map((tenant) => (
//                     <tr key={tenant.id}>
//                       <td className="tenant-name">{tenant.name}</td>
//                       <td className="tenant-text">{tenant.phone}</td>
//                       <td className="tenant-text">{tenant.property}</td>
//                       <td className="tenant-rent">{tenant.rent}</td>
//                       <td className="tenant-text">{tenant.checkIn}</td>
//                       <td>
//                         <span className={`status ${tenant.status.toLowerCase()}`}>
//                           {tenant.status}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           className="view-btn"
//                           onClick={() => setSelectedTenant(tenant)}
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
//                       No Owners found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {selectedTenant && (
//           <div className="modal-overlay" onClick={closeModal}>
//             <div
//               className="modal-content"
//               style={{
//                 maxWidth: showVerification ? "1000px" : "800px",
//                 minHeight: "600px",
//               }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="modal-header">
//                 <h2>{showVerification ? "Tenant Verification" : "Tenant Profile"}</h2>
//                 <button className="close-btn" onClick={closeModal}>
//                   &times;
//                 </button>
//               </div>

//               <div className="modal-body">
//                 {!showVerification ? (
//                   <>
//                     <div
//                       className="owner-profile-card"
//                       style={{ cursor: "default" }}
//                     >
//                       <div
//                         className="avatar-large"
//                         style={{ background: "#10b981" }}
//                       >
//                         {selectedTenant.name
//                           ?.split(" ")
//                           .map((n) => n[0])
//                           .join("")
//                           .toUpperCase()}
//                       </div>

//                       <div>
//                         <h3 style={{ margin: "0 0 5px 0", color: "#065f46" }}>
//                           {selectedTenant.name}
//                         </h3>
//                         <p
//                           style={{
//                             margin: 0,
//                             color: "#6b7280",
//                             fontSize: "14px",
//                           }}
//                         >
//                           {selectedTenant.email} • {selectedTenant.phone}
//                         </p>
//                         <span
//                           className={`status ${selectedTenant.status.toLowerCase()}`}
//                           style={{ display: "inline-block", marginTop: "10px" }}
//                         >
//                           {selectedTenant.status}
//                         </span>
//                       </div>
//                     </div>

//                     <div style={{ marginTop: "25px" }}>
//                       <div
//                         style={{
//                           borderBottom: "1px solid #eee",
//                           paddingBottom: "10px",
//                           marginBottom: "15px",
//                         }}
//                       >
//                         <h4 style={{ color: "#065f46", margin: 0 }}>
//                           Lease Information
//                         </h4>
//                       </div>

//                       <div className="properties-list">
//                         <div
//                           className="property-card"
//                           onClick={() => setShowVerification(true)}
//                           style={{ cursor: "pointer", position: "relative" }}
//                           title="Click to view tenant documents"
//                         >
//                           <div
//                             style={{
//                               fontWeight: "600",
//                               color: "#047857",
//                               marginBottom: "5px",
//                             }}
//                           >
//                             {selectedTenant.property}
//                           </div>

//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               fontSize: "13px",
//                               marginTop: "10px",
//                             }}
//                           >
//                             <span>
//                               <strong style={{ color: "#4b5563" }}>
//                                 Room / Unit:
//                               </strong>{" "}
//                               {selectedTenant.room}
//                             </span>
//                             <span>
//                               <strong style={{ color: "#4b5563" }}>Rent:</strong>{" "}
//                               <span className="tenant-rent">{selectedTenant.rent}</span>
//                             </span>
//                           </div>

//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               fontSize: "13px",
//                               marginTop: "10px",
//                             }}
//                           >
//                             <span>
//                               <strong style={{ color: "#4b5563" }}>
//                                 Move-in Date:
//                               </strong>{" "}
//                               {selectedTenant.checkIn}
//                             </span>
//                           </div>

//                           <div
//                             style={{
//                               fontSize: "13px",
//                               marginTop: "15px",
//                               borderTop: "1px dashed #d1d5db",
//                               paddingTop: "10px",
//                             }}
//                           >
//                             <strong
//                               style={{
//                                 color: "#4b5563",
//                                 display: "block",
//                                 marginBottom: "4px",
//                               }}
//                             >
//                               Emergency Contact:
//                             </strong>
//                             <span style={{ color: "#ef4444" }}>
//                               {selectedTenant.emergencyContact}
//                             </span>
//                           </div>

//                           <div
//                             style={{
//                               textAlign: "right",
//                               marginTop: "10px",
//                               fontSize: "11px",
//                               color: "#10b981",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             View Verification Details →
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="verification-details">
//                     <button
//                       onClick={() => setShowVerification(false)}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         color: "#10b981",
//                         fontWeight: "bold",
//                         cursor: "pointer",
//                         marginBottom: "15px",
//                         padding: 0,
//                       }}
//                     >
//                       ← Back to Summary
//                     </button>

//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "25px",
//                         alignItems: "flex-start",
//                       }}
//                     >
//                       <div style={{ flex: 1 }}>
//                         <div style={{ marginBottom: "15px" }}>
//                           <label style={labelStyle}>Tenant Name</label>
//                           <p style={valueStyle}>{selectedTenant.name}</p>
//                         </div>

//                         <div style={{ marginBottom: "15px" }}>
//                           <label style={labelStyle}>Email Address</label>
//                           <p style={subValueStyle}>{selectedTenant.email}</p>
//                         </div>

//                         <div style={{ marginBottom: "15px" }}>
//                           <label style={labelStyle}>Phone Number</label>
//                           <p style={subValueStyle}>{selectedTenant.phone}</p>
//                         </div>

//                         <div style={{ marginBottom: "15px" }}>
//                           <label style={labelStyle}>ID Proof</label>
//                           <div style={documentLinkStyle}>
//                             <span style={{ fontSize: "18px" }}>📄</span>
//                             <span
//                               style={{
//                                 textDecoration: "underline",
//                                 fontSize: "14px",
//                               }}
//                             >
//                               {selectedTenant.idProof}
//                             </span>
//                           </div>
//                         </div>

//                         <div style={{ marginBottom: "15px" }}>
//                           <label style={labelStyle}>Rental Agreement</label>
//                           <div style={documentLinkStyle}>
//                             <span style={{ fontSize: "18px" }}>📜</span>
//                             <span
//                               style={{
//                                 textDecoration: "underline",
//                                 fontSize: "14px",
//                               }}
//                             >
//                               {selectedTenant.rentalAgreement}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div style={{ width: "180px" }}>
//                         <label
//                           style={{
//                             ...labelStyle,
//                             marginBottom: "10px",
//                           }}
//                         >
//                           Tenant Photo
//                         </label>
//                         <div
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             background: "#f3f4f6",
//                             borderRadius: "12px",
//                             overflow: "hidden",
//                             border: "2px solid #e5e7eb",
//                           }}
//                         >
//                           <img
//                             src={selectedTenant.photo}
//                             alt={selectedTenant.name}
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         </div>
//                         <div style={{ textAlign: "center", marginTop: "10px" }}>
//                           <span
//                             className={`status ${selectedTenant.status.toLowerCase()}`}
//                             style={{ fontSize: "11px" }}
//                           >
//                             {selectedTenant.status} verified
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="modal-footer">
//                 <button className="modal-close-btn" onClick={closeModal}>
//                   Close
//                 </button>
//                 <button
//                   className="modal-contact-btn"
//                   style={{ background: "#10b981", borderColor: "#10b981" }}
//                 >
//                   Message Tenant
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const labelStyle = {
//   display: "block",
//   fontSize: "12px",
//   color: "#9ca3af",
//   fontWeight: "bold",
//   textTransform: "uppercase",
// };

// const valueStyle = {
//   margin: "5px 0",
//   fontSize: "16px",
//   fontWeight: "600",
//   color: "#1f2937",
// };

// const subValueStyle = {
//   margin: "5px 0",
//   fontSize: "15px",
//   color: "#4b5563",
// };

// const documentLinkStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
//   color: "#10b981",
//   marginTop: "5px",
//   cursor: "pointer",
// };

// export default Owners;


import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Owners() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://192.168.1.15:8000/api/owner-admin/");
      // fetch("http://192.168.1.21:8000/api/owner-admin/")
      // const response = await fetch(`http://192.168.1.21:8000/api/check-owner-status/${email}/`)
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

        setTenants(formattedData);
      } else {
        setTenants([]);
        setError("Failed to fetch owner data");
      }
    } catch (error) {
      setTenants([]);
      setError("Fetch error. Server not reachable.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerDetails = async (tenant) => {
    try {
      setSelectedTenant(tenant);
      setOwnerDetails(null);
      setDetailsLoading(true);

      const response = await fetch(
        `http://192.168.1.15:8000/api/owner_data/${tenant.email}/`
      );
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to fetch owner details");
        return;
      }

      setOwnerDetails(result);
    } catch (error) {
      console.error("Owner details fetch error:", error);
      alert("Error fetching owner details");
    } finally {
      setDetailsLoading(false);
    }
  };

  // const updateOwnerStatus = async (email, newStatus) => {
  //   try {
  //     const response = await fetch(
  //       `http://192.168.1.21:8000/api/owner-status/${email}/`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           status: newStatus,
  //         }),
  //       }
  //     );
const updateOwnerStatus = async (email, newStatus) => {
  email = email.trim().toLowerCase(); // ✅ FIX
  // console.log("Sending email:", email); // ✅ DEBUG

  try {
    const response = await fetch(
      `http://192.168.1.15:8000/api/owner-status/${email}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to update status");
        return;
      }

      setTenants((prev) =>
        prev.map((tenant) =>
          tenant.email === email ? { ...tenant, status: newStatus } : tenant
        )
      );

      setSelectedTenant((prev) =>
        prev && prev.email === email ? { ...prev, status: newStatus } : prev
      );

      setOwnerDetails((prev) =>
        prev
          ? {
              ...prev,
              step1: {
                ...prev.step1,
                status: newStatus,
              },
            }
          : prev
      );

      alert("Status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating status. Server not reachable.");
    }
  };

  const closeModal = () => {
    setSelectedTenant(null);
    setOwnerDetails(null);
  };

  const renderLayout = () => {
    if (!ownerDetails?.step3?.building_layout?.length) {
      return <p style={{ color: "#6b7280" }}>No building layout available.</p>;
    }

    const type = ownerDetails.property_type;

    return ownerDetails.step3.building_layout.map((floor, index) => (
      <div key={index} style={floorCardStyle}>
        <h4 style={{ margin: "0 0 12px 0", color: "#1f2937" }}>
          Floor {floor.floorNo}
        </h4>

        {type === "hostel" &&
          floor.rooms?.map((room, i) => (
            <div key={i} style={itemRowStyle}>
              <span>Room No: {room.roomNo}</span>
              <span>{room.beds} Beds</span>
            </div>
          ))}

        {type === "apartment" &&
          floor.flats?.map((flat, i) => (
            <div key={i} style={itemRowStyle}>
              <span>Flat No: {flat.flatNo}</span>
              <span>{flat.bhk} BHK</span>
            </div>
          ))}

        {type === "commercial" &&
          floor.sections?.map((section, i) => (
            <div key={i} style={itemRowStyle}>
              <span>Section No: {section.sectionNo}</span>
              <span>{section.area_sqft} sqft</span>
            </div>
          ))}
      </div>
    ));
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main" style={{ padding: 0 }}>
        <Header />

        <div className="tenants-container" style={{ padding: "30px" }}>
          <div className="tenants-header">
            <div>
              <h2 style={{ color: "#4c1d95" }}>Owners</h2>
              <p style={{ color: "#c084fc", marginBottom: "20px" }}>
                Manage Owners and leases
              </p>
            </div>
          </div>

          {loading ? (
            <p>Loading Owners...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <table className="owners-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Properties</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tenants.length > 0 ? (
                  tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td className="owner-cell">
                        <div className="avatar">
                          {tenant.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        {tenant.name}
                      </td>

                      <td>{tenant.phone}</td>
                      <td>{tenant.email}</td>
                      <td>{tenant.property}</td>

                      <td>
                        <span className={`status ${tenant.status.toLowerCase()}`}>
                          {tenant.status}
                        </span>
                      </td>

                      <td>
                        <button className="edit">Edit</button>

                        <button
                          className="approve"
                          onClick={() => updateOwnerStatus(tenant.email, "active")}
                        >
                          Approve
                        </button>

                        <button
                          className="suspend"
                          onClick={() => updateOwnerStatus(tenant.email, "suspend")}
                        >
                          Suspend
                        </button>

                        <button
                          className="view-btn"
                          onClick={() => fetchOwnerDetails(tenant)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                      No Owners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {selectedTenant && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="modal-content"
              style={{
                maxWidth: "1100px",
                width: "95%",
                minHeight: "650px",
                borderRadius: "20px",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "white",
                  padding: "22px 28px",
                }}
              >
                <div>
                  <h2 style={{ margin: 0 }}>Owner Details</h2>
                  <p style={{ margin: "6px 0 0 0", opacity: 0.9 }}>
                    Complete owner profile, property, bank and building details
                  </p>
                </div>
                <button
                  className="close-btn"
                  onClick={closeModal}
                  style={{ color: "white", fontSize: "26px" }}
                >
                  &times;
                </button>
              </div>

              <div
                className="modal-body"
                style={{ padding: "24px", background: "#f8fafc" }}
              >
                {detailsLoading ? (
                  <p>Loading full owner details...</p>
                ) : ownerDetails ? (
                  <>
                    <div style={topProfileCard}>
                      <div style={avatarBig}>
                        {ownerDetails.step1?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, color: "#111827" }}>
                          {ownerDetails.step1?.name}
                        </h3>
                        <p style={{ margin: "8px 0", color: "#6b7280" }}>
                          {ownerDetails.step1?.email} • {ownerDetails.step1?.phone}
                        </p>

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <span style={badgeStyle(ownerDetails.step1?.status)}>
                            {ownerDetails.step1?.status}
                          </span>
                          <span style={typeBadge}>
                            {ownerDetails.property_type}
                          </span>
                        </div>
                      </div>

                      {ownerDetails.step1?.owner_img_field && (
                        <img
                          src={ownerDetails.step1.owner_img_field}
                          alt="Owner"
                          style={ownerImageStyle}
                        />
                      )}
                    </div>

                    <div style={gridStyle}>
                      <div style={sectionCard}>
                        <h3 style={sectionTitle}>Step 1 - Owner Details</h3>
                        <InfoRow label="Owner ID" value={ownerDetails.step1?.id} />
                        <InfoRow label="Name" value={ownerDetails.step1?.name} />
                        <InfoRow label="Email" value={ownerDetails.step1?.email} />
                        <InfoRow label="Phone" value={ownerDetails.step1?.phone} />
                        <InfoRow label="Status" value={ownerDetails.step1?.status} />
                      </div>

                      <div style={sectionCard}>
                        <h3 style={sectionTitle}>Step 2 - Property Details</h3>
                        <InfoRow
                          label="Stay Type"
                          value={ownerDetails.step2?.property_details?.stayType}
                        />
                        <InfoRow
                          label="Location"
                          value={ownerDetails.step2?.property_details?.location}
                        />

                        {ownerDetails.property_type === "hostel" && (
                          <>
                            <InfoRow
                              label="Hostel Name"
                              value={ownerDetails.step2?.property_details?.hostelName}
                            />
                            <InfoRow
                              label="Hostel Type"
                              value={ownerDetails.step2?.property_details?.hostelType}
                            />
                          </>
                        )}

                        {ownerDetails.property_type === "apartment" && (
                          <>
                            <InfoRow
                              label="Apartment Name"
                              value={ownerDetails.step2?.property_details?.apartmentName}
                            />
                            <InfoRow
                              label="Tenant Type"
                              value={ownerDetails.step2?.property_details?.tenantType}
                            />
                          </>
                        )}

                        {ownerDetails.property_type === "commercial" && (
                          <>
                            <InfoRow
                              label="Commercial Name"
                              value={ownerDetails.step2?.property_details?.commercialName}
                            />
                            <InfoRow
                              label="Usage"
                              value={ownerDetails.step2?.property_details?.usage}
                            />
                          </>
                        )}

                        <div style={{ marginTop: "14px" }}>
                          <label style={smallLabel}>Facilities</label>
                          <div style={chipWrap}>
                            {ownerDetails.step2?.property_details?.facilities?.length > 0 ? (
                              ownerDetails.step2.property_details.facilities.map((facility, i) => (
                                <span key={i} style={chipStyle}>
                                  {facility}
                                </span>
                              ))
                            ) : (
                              <span style={{ color: "#6b7280" }}>No facilities</span>
                            )}
                          </div>
                        </div>

                        {ownerDetails.step2?.property_details?.owner_ship_proof && (
                          <div style={{ marginTop: "16px" }}>
                            <a
                              href={ownerDetails.step2.property_details.owner_ship_proof}
                              target="_blank"
                              rel="noreferrer"
                              style={linkStyle}
                            >
                              View Ownership Proof
                            </a>
                          </div>
                        )}
                      </div>

                      <div style={sectionCard}>
                        <h3 style={sectionTitle}>Bank Details</h3>
                        <InfoRow
                          label="Bank Name"
                          value={ownerDetails.step2?.bank_details?.bankName}
                        />
                        <InfoRow
                          label="IFSC"
                          value={ownerDetails.step2?.bank_details?.ifsc}
                        />
                        <InfoRow
                          label="Account No"
                          value={ownerDetails.step2?.bank_details?.accountNo}
                        />
                      </div>

                      <div style={sectionCard}>
                        <h3 style={sectionTitle}>Gallery Images</h3>
                        {ownerDetails.step2?.property_details?.gallery_images?.length > 0 ? (
                          <div style={galleryGrid}>
                            {ownerDetails.step2.property_details.gallery_images.map(
                              (img, index) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt={`Gallery ${index + 1}`}
                                  style={galleryImage}
                                />
                              )
                            )}
                          </div>
                        ) : (
                          <p style={{ color: "#6b7280" }}>No gallery images uploaded.</p>
                        )}
                      </div>
                    </div>

                    <div style={{ ...sectionCard, marginTop: "20px" }}>
                      <h3 style={sectionTitle}>Step 3 - Building Layout</h3>
                      <div style={layoutGrid}>{renderLayout()}</div>
                    </div>
                  </>
                ) : (
                  <p>No details found.</p>
                )}
              </div>

              <div
                className="modal-footer"
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid #e5e7eb",
                  background: "#fff",
                }}
              >
                <button className="modal-close-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={infoRowStyle}>
      <span style={infoLabelStyle}>{label}</span>
      <span style={infoValueStyle}>{value || "N/A"}</span>
    </div>
  );
}

const topProfileCard = {
  background: "#ffffff",
  borderRadius: "18px",
  padding: "20px",
  display: "flex",
  gap: "18px",
  alignItems: "center",
  marginBottom: "20px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

const avatarBig = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #10b981, #059669)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "24px",
};

const ownerImageStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "14px",
  objectFit: "cover",
  border: "2px solid #e5e7eb",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const sectionCard = {
  background: "#ffffff",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

const sectionTitle = {
  margin: "0 0 16px 0",
  color: "#111827",
  fontSize: "18px",
  fontWeight: "700",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  padding: "10px 0",
  borderBottom: "1px solid #f1f5f9",
};

const infoLabelStyle = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
};

const infoValueStyle = {
  color: "#111827",
  fontSize: "14px",
  textAlign: "right",
};

const smallLabel = {
  display: "block",
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: "700",
  marginBottom: "8px",
  textTransform: "uppercase",
};

const chipWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const chipStyle = {
  background: "#ede9fe",
  color: "#5b21b6",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "600",
};

const galleryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
  gap: "10px",
};

const galleryImage = {
  width: "100%",
  height: "100px",
  objectFit: "cover",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const layoutGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const floorCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "16px",
  background: "#f9fafb",
};

const itemRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px dashed #d1d5db",
  color: "#374151",
  fontSize: "14px",
};

const typeBadge = {
  background: "#dbeafe",
  color: "#1d4ed8",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "capitalize",
};

const badgeStyle = (status) => {
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