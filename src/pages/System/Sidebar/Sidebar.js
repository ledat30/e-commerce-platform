import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.scss";
import "./boxicons.min.scss";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

function Sidebar(props) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(UserContext);
  const location = useLocation();

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
            <div className="logo_name">CodingStella</div>
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
            <li className="profile">
              <div className="profile-details">
                <img
                  src="https://drive.google.com/uc?export=view&id=1ETZYgPpWbbBtpJnhi42_IR3vOwSOpR4z"
                  alt="profileImg"
                />
                <div className="name_job">
                  <div className="name">Stella Army</div>
                </div>
              </div>
              <i className="fa fa-sign-out" aria-hidden="true" id="log_out"></i>
            </li>
          </ul>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

export default Sidebar;
