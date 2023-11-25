import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/System/Shipper/Dashboard/Dashboard";

function ShipperDashboard() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} exact />
    </Routes>
  );
}

export default ShipperDashboard;
