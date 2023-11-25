import React from "react";
import { Route, Switch } from "react-router-dom";

function UserDashboard() {
  return (
    <>
      <Switch>
        <Route path="/user/dashboard" exact>
          {/* Nội dung trang Dashboard của người dùng */}
        </Route>
        <Route path="/user/profile">
          {/* Nội dung trang thông tin cá nhân của người dùng */}
        </Route>
        {/* Các router khác cho vai trò người dùng */}
      </Switch>
    </>
  );
}

export default UserDashboard;
