import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.scss";
import "./boxicons.min.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { logoutUser } from "../../../services/userService";
import { toast } from "react-toastify";

function Sidebar(props) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
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

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const menuItems = [];

  if (
    user &&
    user.isAuthenticated === true &&
    user.account.groupWithRoles.id === 1
  ) {
    menuItems.push(
      { to: "/", label: "Dashboard", icon: "fa-home" },
      { to: "/admin/users", label: "User", icon: "fa-user" },
      { to: "/admin/role", label: "Role", icon: "fa-shield" },
      { to: "/admin/group-role", label: "Group role", icon: "fa-users" },
      { to: "/admin/category", label: "Category", icon: "fa-list-alt" },
      { to: "/admin/store", label: "Store", icon: "fa-building" },
      { to: "/admin/shipping-unit", label: "Shipping Unit", icon: "fa-truck" },
      { to: "/admin/payment-method", label: "Payment method", icon: "fa-credit-card " },
      { to: "/admin/contact", label: "Contact", icon: "fa-commenting" },
    );
  }

  if (
    user &&
    user.isAuthenticated === true &&
    user.account.groupWithRoles.id === 2
  ) {
    menuItems.push(
      { to: "/", label: "Dashboard", icon: "fa-home" },
      { to: "/store-owner/revenue", label: "Revenue", icon: "fa fa-money" },
      { to: "/store-owner/statistical", label: "Statistical", icon: "fa fa-bar-chart" },
      { to: "/store-owner/attribute", label: "Attibute", icon: "fa-list-alt" },
      { to: "/store-owner/variant", label: "Variant", icon: "fa-arrows-alt" },
      { to: "/store-owner/product", label: "Products", icon: "fa-product-hunt" },
      { to: "/store-owner/inventory", label: "Inventory", icon: "fa fa-archive" },
      { to: "/admin/comment", label: "Comment", icon: "fa-commenting-o " },
      { to: "/admin/order", label: "Order", icon: "fa-shopping-cart" },
    );
  }

  if (
    user &&
    user.isAuthenticated === true &&
    user.account.groupWithRoles.id === 3
  ) {
    menuItems.push(
      { to: "/", label: "Dashboard", icon: "fa-home" },
      { to: '/shippingUnit_order', label: "Shipping Unit order", icon: "fa-truck" },
    );
  }

  if (
    user &&
    user.isAuthenticated === true &&
    user.account.groupWithRoles.id === 5
  ) {
    menuItems.push(
      { to: "/", label: "Dashboard", icon: "fa-home" },
      { to: '/shipper-order', label: "Order needs delivery", icon: "fa-truck" },
      { to: '/application-has-been-shipped', label: "Shipping order", icon: "fa-ambulance" },
    );
  }

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchInput.toLowerCase())
  );

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
              <input
                className="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <span className="tooltip">Search</span>
            </li>
            {filteredItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item.to} activeclassname="active">
                  <i className={`fa ${item.icon}`} aria-hidden="true"></i>
                  <span className="links_name">{item.label}</span>
                </NavLink>
                <span className="tooltip">{item.label}</span>
              </li>
            ))}

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
