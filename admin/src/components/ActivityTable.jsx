import React from "react";

function ActivityTable() {

    const data = [
        {
            owner: "James Wilson",
            property: "Sunrise Apartments",
            tenant: "Sarah Connor",
            status: "Confirmed",
            date: "Jan 15 2025"
        },
        {
            owner: "Emily Zhang",
            property: "Ocean View Villa",
            tenant: "Mike Torres",
            status: "Pending",
            date: "Jan 14 2025"
        },
        {
            owner: "Robert Chen",
            property: "Metro Loft",
            tenant: "Anna Bell",
            status: "Confirmed",
            date: "Jan 13 2025"
        }
    ];

    return (
        <div className="tableBox">

            <h2 className="recentactivity">Recent Activity</h2>

            <table>

                <thead className="tableHeader">
                    <tr>
                        <th>Owner</th>
                        <th>Property</th>
                        <th>Tenant</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.owner}</td>
                            <td>{item.property}</td>
                            <td>{item.tenant}</td>
                            <td>
                                <span className={`status ${item.status}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>{item.date}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default ActivityTable;