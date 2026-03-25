import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import ActivityTable from "../components/ActivityTable";
import ChartsSection from "../components/ChartsSection";
import Header from "../components/Header";

function Dashboard({ onLogout }) {

    const [activeTab, setActiveTab] = useState("overview");

    const closeModal = () => setActiveTab("overview");

    const renderModalContent = () => {
        if (activeTab === "Total Owners") {
            return (
                <div className="tableBox" style={{ marginTop: 0 }}>
                    <table>
                        <thead>
                            <tr className="tableHeader">
                                <th>Name</th>
                                <th>Properties</th>
                                <th>Property Type</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>James Wilson</td>
                                <td>Sunrise Apartments</td>
                                <td>Apartment</td>
                                <td>james@email.com</td>
                            </tr>
                            <tr>
                                <td>Emily Zhang</td>
                                <td>Ocean View Villa</td>
                                <td>Hostel</td>
                                <td>emily@email.com</td>
                            </tr>
                            <tr>
                                <td>Robert Chen</td>
                                <td>Metro Loft</td>
                                <td>Commercial Space</td>
                                <td>robert@email.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
        
        if (activeTab === "Total Tenants") {
            return (
                <div className="tableBox" style={{ marginTop: 0 }}>
                    <table>
                        <thead>
                            <tr className="tableHeader">
                                <th>Name</th>
                                <th>Property</th>
                                <th>Property Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sarah Connor</td>
                                <td>Sunrise Apartments</td>
                                <td>Apartment</td>
                                <td><span className="status Confirmed">Active</span></td>
                            </tr>
                            <tr>
                                <td>Mike Torres</td>
                                <td>Ocean View Villa</td>
                                <td>Hostel</td>
                                <td><span className="status Pending">Pending</span></td>
                            </tr>
                            <tr>
                                <td>David Miller</td>
                                <td>Metro Loft</td>
                                <td>Commercial Space</td>
                                <td><span className="status Confirmed">Active</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }

        if (activeTab === "Total Properties") {
            return (
                <div className="tableBox" style={{ marginTop: 0 }}>
                    <table>
                        <thead>
                            <tr className="tableHeader">
                                <th>Name</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sunrise Apartments</td>
                                <td>123 Main St, NY</td>
                                <td>Apartment</td>
                                <td><span className="status Confirmed">Occupied</span></td>
                            </tr>
                            <tr>
                                <td>Ocean View Villa</td>
                                <td>88 Beach Rd, CA</td>
                                <td>Hostel</td>
                                <td><span className="status Confirmed">Occupied</span></td>
                            </tr>
                            <tr>
                                <td>Metro Loft</td>
                                <td>200 City Center, TX</td>
                                <td>Commercial Space</td>
                                <td><span className="status Pending">Available</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
        return null;
    };

    return (
        <div className="dashboard">

            <Sidebar />

            <div className="main" style={{ padding: 0 }}>

                {/* Top Header */}
                <Header onLogout={onLogout} />

                <div style={{ padding: '0 30px 30px 30px' }}>
                    {/* Welcome Text */}
                    <div style={{ marginTop: '20px' }}>
                    <h1 className="welcome" style={{ margin: 0 }}>
                        Welcome back, Admin 👋
                    </h1>
                    <p className="subtitle" style={{ marginTop: '5px' }}>
                        Here's what's happening with your properties today.
                    </p>
                </div>

                {/* Stats Cards - Horizontal Row */}
                <StatsCards onCardClick={(title) => {
                    if (["Total Owners", "Total Tenants", "Total Properties"].includes(title)) {
                        setActiveTab(title);
                    }
                }} />

                {/* Dashboard Sections always visible */}
                <div className="dashboard-sections">
                    <div className="charts-section">
                        <h2 className="section-title">Analytics Overview</h2>
                        <ChartsSection />
                    </div>

                    <div className="activities-section">
                        <h2 className="section-title">Recent Activities</h2>
                        <ActivityTable />
                    </div>
                </div>

                {activeTab !== "overview" && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', minHeight: '500px' }}>
                            
                            <div className="modal-header">
                                <h2>{activeTab} Directory (Default Data)</h2>
                                <button className="close-btn" onClick={closeModal}>&times;</button>
                            </div>

                            <div className="modal-body" style={{ padding: '0 20px 20px 20px' }}>
                                {renderModalContent()}
                            </div>
                        </div>
                    </div>
                )}
                
                </div>

            </div>

        </div>
    );
}

export default Dashboard;