import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/System/Admin/Dashboard/Dashboard";
import User from "../pages/System/Admin/User/User";
import NotFound from "../pages/System/NotFound";
import Login from "../pages/System/Login/Login";
import PrivateRoutes from "./PrivateRoutes";
import Role from "../pages/System/Admin/Role/Role";
import GroupRole from "../pages/System/Admin/GroupRole/GroupRole";
import Category from "../pages/System/Admin/Category/Category";
import Store from "../pages/System/Admin/Store/Store";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoutes element={<Dashboard />} />} />
      <Route
        path="/admin/users"
        element={<PrivateRoutes element={<User />} />}
      />
      <Route
        path="/admin/role"
        element={<PrivateRoutes element={<Role />} />}
      />
      <Route
        path="/admin/group-role"
        element={<PrivateRoutes element={<GroupRole />} />}
      />
      <Route
        path="/admin/category"
        element={<PrivateRoutes element={<Category />} />}
      />
      <Route
        path="/admin/store"
        element={<PrivateRoutes element={<Store />} />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
