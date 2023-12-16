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
import ShippingUnit from "../pages/System/Admin/ShippingUnit/Shipping_Unit";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Navigate } from "react-router-dom";
import Product from "../pages/System/Store_Owner/Product/Product";

function AppRoutes() {
  const { user } = useContext(UserContext);
  console.log(user);

  if (user && user.isAuthenticated === true) {
    if (user.account.groupWithRoles.id === 1) {
      return (
        <Routes>
          {/* admin routes */}
          <>
            <Route
              path="/"
              element={<PrivateRoutes element={<Dashboard />} />}
            />
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
            <Route
              path="/admin/shipping-unit"
              element={<PrivateRoutes element={<ShippingUnit />} />}
            />
          </>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else if (user.account.groupWithRoles.id === 2) {
      return (
        <Routes>
          {/* store owner routes */}
          <>
            <Route
              path="/"
              element={<PrivateRoutes element={<Dashboard />} />}
            />
            <Route
              path="/store-owner/product"
              element={<PrivateRoutes element={<Product />} />}
            />
          </>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else {
      return <Navigate to="/login" />;
    }
  } else {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
}

export default AppRoutes;
