import React, { useState, useEffect } from "react";
import { getUserAccount } from "../services/userService";

const UserContext = React.createContext(null);

function UserProvider({ children }) {
  // User is the name of the "data" that gets stored in context
  const defaultData = {
    isLoading: true,
    isAuthenticated: false,
    token: "",
    account: {},
  };

  const [user, setUser] = useState(defaultData);

  // Login updates the user data with a name parameter
  const loginContext = (userData) => {
    setUser({ ...userData, isLoading: false });
  };

  // Logout updates the user data to default
  const logoutContext = () => {
    setUser({ ...defaultData, isLoading: false });
  };

  const fetchUser = async () => {
    let response = await getUserAccount();
    if (response && response.EC === 0) {
      let groupWithRoles = response.DT.groupWithRoles;
      let email = response.DT.email;
      let username = response.DT.username;
      let token = response.DT.access_token;
      let data = {
        isAuthenticated: true,
        token: token,
        account: { groupWithRoles, email, username },
        isLoading: false,
      };
      setTimeout(() => {
        setUser(data);
      }, 200);
    } else {
      setUser({ ...defaultData, isLoading: false });
    }
  };

  useEffect(() => {
    if (window.location.pathname !== "/login") {
      fetchUser();
    } else {
      setUser({ ...user, isLoading: false });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
