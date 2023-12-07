import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.scss";
import "./boxicons.min.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { logoutUser } from "../../../services/userService";
import { toast } from "react-toastify";

function Sidebar(props) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutContext } = useContext(UserContext);
  let navigate = useNavigate();

  const handleLogout = async () => {
    let data = await logoutUser(); //clear cookies
    localStorage.removeItem("jwt"); //clear localStorage
    logoutContext(); //clear user in context
    if (data && +data.EC === 0) {
      toast.success("Logout successful");
      navigate("/login");
    } else {
      toast.error(data.EM);
    }
  };

  useEffect(() => {
    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };

    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".fa-search");

    // Check if elements are available before adding event listeners
    if (closeBtn) {
      closeBtn.addEventListener("click", toggleSidebar);
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", toggleSidebar);
    }

    return () => {
      if (closeBtn) {
        closeBtn.removeEventListener("click", toggleSidebar);
      }

      if (searchBtn) {
        searchBtn.removeEventListener("click", toggleSidebar);
      }
    };
  }, [isSidebarOpen]);

  if (user && user.isAuthenticated === true) {
    return (
      <>
        <div className={`sidebar ${isSidebarOpen ? "" : "open"}`}>
          <div className="logo-details">
            <div className="logo_name">E-commerce</div>
            <i className="fa fa-bars" aria-hidden="true" id="btn"></i>
          </div>
          <ul className="nav-list">
            <li>
              <i className="fa fa-search"></i>
              <input className="text" placeholder="Search..." />
              <span className="tooltip">Search</span>
            </li>
            <li>
              <NavLink to="/">
                <i className="fa fa-home" aria-hidden="true"></i>
                <span className="links_name">Dashboard</span>
              </NavLink>
              <span className="tooltip">Dashboard</span>
            </li>
            <li>
              <NavLink to="/admin/users">
                <i className="fa fa-user" aria-hidden="true"></i>
                <span className="links_name">User</span>
              </NavLink>
              <span className="tooltip">User</span>
            </li>
            {/* <li>
            <NavLink to="#">
              <i className="bx bx-user"></i>
              <span className="links_name">User</span>
            </NavLink>
            <span className="tooltip">User</span>
          </li>
  */}
            {user && user.isAuthenticated === true && (
              <li className="profile">
                <div className="profile-details">
                  <img
                    src="https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png"
                    alt="profileImg"
                  />
                  <div className="name_job">
                    <div className="name">{user.account.username}</div>
                  </div>
                </div>
                <i
                  className="fa fa-sign-out"
                  aria-hidden="true"
                  id="log_out"
                  onClick={() => handleLogout()}
                ></i>
              </li>
            )}
          </ul>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

export default Sidebar;
