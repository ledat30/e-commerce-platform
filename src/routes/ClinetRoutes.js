import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "../pages/System/NotFound";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Navigate } from "react-router-dom";
import Login from "../pages/System/Login/Login";
import HomePage from "../pages/HomePage/HomePage";
import DetailProduct from "../pages/HomePage/Section/DetailProduct/DetailProduct";
import DetailCart from "../pages/HomePage/Section/DetailCart/DetailCart";

function ClinetRoutes() {
  const { user } = useContext(UserContext);

  if (user && user.isAuthenticated === true) {
    if (user.account.groupWithRoles.id === 4) {
      return (
        <Routes>
          {/* custommer routes */}
          <>
            <Route
              path="/home"
              element={<PrivateRoutes element={<HomePage />} />}
            />
            <Route
              path="/product/:id"
              element={<PrivateRoutes element={<DetailProduct />} />}
            />
            <Route
              path="/detail-cart"
              element={<PrivateRoutes element={<DetailCart />} />}
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

export default ClinetRoutes;