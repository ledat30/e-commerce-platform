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
import PaymentMethod from "../pages/System/Admin/PaymentMethod/PaymentMethod";
import InVentory from "../pages/System/Store_Owner/Inventory/InVentory";
import Color from "../pages/System/Store_Owner/Color/Color";
import Size from "../pages/System/Store_Owner/Size/Size";
import Comment from "../pages/System/Store_Owner/Comment/Comment";
import Order from "../pages/System/Store_Owner/Order/Order";
import ShippingUnit_Order from "../pages/System/ShippingUnit/ShippingUnit_Order/ShippingUnit_Order";
import OrderNeedsDelivery from '../pages/System/Shipper/OrderNeedsDelivery/OrderNeedsDelivery';
import ShippingOrder from "../pages/System/Shipper/ShippingOrder/ShippingOrder";
import DashboardStore from '../pages/System/Store_Owner/Dashboard/Dashboard';
import DashboardShippingUnit from "../pages/System/ShippingUnit/Dashboard/Dashboard";
import DashboardShipper from "../pages/System/Shipper/Dashboard/Dashboard";

function AppRoutes() {
  const { user } = useContext(UserContext);

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
            <Route
              path="/admin/payment-method"
              element={<PrivateRoutes element={<PaymentMethod />} />}
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
              element={<PrivateRoutes element={<DashboardStore />} />}
            />
            <Route
              path="/store-owner/product"
              element={<PrivateRoutes element={<Product />} />}
            />
            <Route
              path="/store-owner/inventory"
              element={<PrivateRoutes element={<InVentory />} />}
            />
            <Route
              path="/store-owner/color"
              element={<PrivateRoutes element={<Color />} />}
            />
            <Route
              path="/store-owner/size"
              element={<PrivateRoutes element={<Size />} />}
            />
            <Route
              path="/admin/comment"
              element={<PrivateRoutes element={<Comment />} />}
            />
            <Route
              path="/admin/order"
              element={<PrivateRoutes element={<Order />} />}
            />
          </>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else if (user.account.groupWithRoles.id === 3) {
      return (
        <Routes>
          {/* shipping unit routes */}
          <>
            <Route
              path="/"
              element={<PrivateRoutes element={<DashboardShippingUnit />} />}
            />
            <Route
              path="/shippingUnit_order"
              element={<PrivateRoutes element={<ShippingUnit_Order />} />}
            />
          </>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    } else if (user.account.groupWithRoles.id === 5) {
      return (
        <Routes>
          {/* shipper routes */}
          <>
            <Route
              path="/"
              element={<PrivateRoutes element={<DashboardShipper />} />}
            />
            <Route
              path="/shipper-order"
              element={<PrivateRoutes element={<OrderNeedsDelivery />} />}
            />
            <Route
              path="/application-has-been-shipped"
              element={<PrivateRoutes element={<ShippingOrder />} />}
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
