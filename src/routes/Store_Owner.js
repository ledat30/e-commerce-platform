import React from "react";
import { Route, Switch } from "react-router-dom";

function StoreOwnerDashboard() {
  return (
    <>
      <Switch>
        <Route path="/store-owner/dashboard" exact>
          {/* Nội dung trang Dashboard của chủ cửa hàng */}
        </Route>
        <Route path="/store-owner/orders">
          {/* Nội dung trang quản lý đơn hàng của chủ cửa hàng */}
        </Route>
        {/* Các router khác cho vai trò chủ cửa hàng */}
      </Switch>
    </>
  );
}

export default StoreOwnerDashboard;
