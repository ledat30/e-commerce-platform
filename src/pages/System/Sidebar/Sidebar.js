import React, { useEffect, useState } from "react";
import "./Sidebar.scss";
import "./boxicons.min.scss";
import { NavLink } from "react-router-dom";

function Sidebar(props) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };

    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".fa-search");

    closeBtn.addEventListener("click", toggleSidebar);
    searchBtn.addEventListener("click", toggleSidebar);

    return () => {
      closeBtn.removeEventListener("click", toggleSidebar);
      searchBtn.removeEventListener("click", toggleSidebar);
    };
  }, [isSidebarOpen]);
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
}

export default Sidebar;
