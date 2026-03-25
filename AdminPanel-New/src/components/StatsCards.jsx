import React from "react";
import {
    FaUsers,
    FaUserFriends,
    FaHome,
    FaCalendarCheck,
    FaChartLine
} from "react-icons/fa";
// import "./StatsCards.css"; // Make sure to import the CSS

function StatsCards({ onCardClick }) {

    const stats = [
        {
            title: "Total Owners",
            value: "248",
            icon: <FaUsers />,
            color: "#6c3bff",
            percent: "+12%"
        },
        {
            title: "Total Tenants",
            value: "1,024",
            icon: <FaUserFriends />,
            color: "#3b82f6",
            percent: "+8%"
        },
        {
            title: "Total Properties",
            value: "562",
            icon: <FaHome />,
            color: "#f59e0b",
            percent: "+5%"
        },
        {
            title: "Active Bookings",
            value: "89",
            icon: <FaCalendarCheck />,
            color: "#10b981",
            percent: "-3%"
        },
        {
            title: "Monthly Revenue",
            value: "$84.5K",
            icon: <FaChartLine />,
            color: "#ec4899",
            percent: "+18%"
        }
    ];

    return (
        <div className="statsContainer">
            {stats.map((item, index) => (
                <div 
                    className="statsCard" 
                    key={index} 
                    onClick={() => onCardClick && onCardClick(item.title)}
                    style={{ cursor: onCardClick ? 'pointer' : 'default' }}
                >
                    <div className={`percentBadge ${item.percent.startsWith('+') ? 'positive' : 'negative'}`}>
                        {item.percent}
                    </div>
                    <div className="cardRow">
                        <div className="cardIcon" style={{ backgroundColor: item.color }}>
                            {item.icon}
                        </div>
                    </div>
                    <h3 className="cardValue">{item.value}</h3>
                    <p className="cardTitle">{item.title}</p>
                </div>
            ))}
        </div>
    );
}

export default StatsCards; 