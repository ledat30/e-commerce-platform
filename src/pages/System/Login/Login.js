import "./Login.scss";
import React, { useState } from "react";

function Login(props) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="container">
      <div className="screen-1">
        <div className="title-login">Login</div>
        <div className="email">
          <label htmlFor="email">Email Address</label>
          <div className="sec-2">
            <i className="fa fa-envelope-o" aria-hidden="true"></i>
            <input type="email" name="email" placeholder="Username@gmail.com" />
          </div>
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <div className="sec-2">
            <i className="fa fa-unlock-alt" aria-hidden="true"></i>
            <input
              className="pas"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Please enter a password!"
            />
            <i
              className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
              aria-hidden="true"
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>
        <button className="login">Login</button>
        <div className="footer">
          <span className="forgot-password">Forgot Password?</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
