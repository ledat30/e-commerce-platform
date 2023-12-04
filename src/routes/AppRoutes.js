import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/System/Admin/Dashboard/Dashboard";
import User from "../pages/System/Admin/User/User";
import NotFound from "../pages/System/NotFound";
import Login from "../pages/System/Login/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} exact />
      <Route path="/admin/users" element={<User />} />

      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
