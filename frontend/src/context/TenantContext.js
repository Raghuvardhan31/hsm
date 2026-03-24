// src/context/TenantContext.js
import React, { createContext, useState } from "react";

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [tenantEmail, setTenantEmail] = useState("");

  return (
    <TenantContext.Provider value={{ tenantEmail, setTenantEmail }}>
      {children}
    </TenantContext.Provider>
  );
};