import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  // 🔥 COUNT ONLY NEW (UNSEEN) NOTIFICATIONS
  const pendingCount = requests.filter(
    (r) =>
      (r.status === "accepted" || r.status === "rejected") &&
      !r.seen
  ).length;

  return (
    <BookingContext.Provider
      value={{ requests, setRequests, pendingCount }}
    >
      {children}
    </BookingContext.Provider>
  );
};