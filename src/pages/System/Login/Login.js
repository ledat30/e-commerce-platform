import "./Login.scss";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../../services/userService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

function Login(props) {
  const { loginContext } = useContext(UserContext);

  let navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const defaultObjValidInput = {
    isValidValueLogin: true,
    isValidValuePassword: true,
  };
  const [objValidInput, setObjValidInput] = useState(defaultObjValidInput);

  const handleLogin = async () => {
    setObjValidInput(defaultObjValidInput);
    if (!valueLogin) {
      toast.error("Please enter your email address or phone number");
      setObjValidInput({ ...defaultObjValidInput, isValidValueLogin: false });
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      setObjValidInput({
        ...defaultObjValidInput,
        isValidValuePassword: false,
      });
      return;
    }

    let response = await loginUser(valueLogin, password);
    if (response && +response.EC === 0) {
      //success
      let groupWithRoles = response.DT.groupWithRoles;
      let email = response.DT.email;
      let phonenumber = response.DT.phonenumber;
      let username = response.DT.username;
      let address = response.DT.address;
      let token = response.DT.access_token;
      let id = response.DT.id;
      let storeId = response.DT.storeId;
      let nameStore = response.DT.nameStore;
      let shipingUnitId = response.DT.shipingUnitId;
      let shipingUnitName = response.DT.shipingUnitName;
      let data = {
        isAuthenticated: true,
        token: token,
        account: { groupWithRoles, email, phonenumber, username, address, id, storeId, nameStore, shipingUnitId, shipingUnitName },
      };
      localStorage.setItem("jwt", token);
      loginContext(data);
      if (
        groupWithRoles.id === 1 ||
        groupWithRoles.id === 2 ||
        groupWithRoles.id === 3 ||
        groupWithRoles.id === 5
      ) {
        navigate("/");
      } else if (groupWithRoles.id === 4) {
        navigate("/home");
      }
      toast.success("Login successful");
    }
    if (response && +response.EC !== 0) {
      toast.error(response.EM);
    }
  };

  const handlePressEnter = (e) => {
    if (e.charCode === 13 && e.code === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="screen-1">
        <div className="title-login">Login</div>
        <div className="email">
          <label htmlFor="email">Email Address</label>
          <div className="sec-2">
            <i className="fa fa-envelope-o" aria-hidden="true"></i>
            <input
              type="email"
              name="email"
              value={valueLogin}
              onChange={(e) => {
                setValueLogin(e.target.value);
              }}
              placeholder="Username@gmail.com"
              className={
                objValidInput.isValidValueLogin
                  ? "email-user"
                  : "email-user is-invalid"
              }
            />
          </div>
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <div className="sec-2">
            <i className="fa fa-unlock-alt" aria-hidden="true"></i>
            <input
              className={
                objValidInput.isValidValuePassword ? "pas" : "pas is-invalid"
              }
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Please enter a password!"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyPress={(e) => handlePressEnter(e)}
            />
            <i
              className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
              aria-hidden="true"
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>
        <button className="login" onClick={() => handleLogin()}>
          Login
        </button>
        <div className="footer-login">
          <span className="forgot-password">Forgot Password?</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
