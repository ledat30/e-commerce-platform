import React, { useState, useEffect } from "react";
import { getUserAccount, editProfile } from "../services/userService";

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

  const updateUserInfo = (newUserInfo) => {
    setUser((prevUser) => ({
      ...prevUser,
      account: { ...prevUser.account, ...newUserInfo },
    }));
  };

  const fetchUser = async () => {
    let response = await getUserAccount();
    if (response && response.EC === 0) {
      let groupWithRoles = response.DT.groupWithRoles;
      let email = response.DT.email;
      let phonenumber = response.DT.phonenumber;
      let username = response.DT.username;
      let provinceId = response.DT.provinceId;
      let districtId = response.DT.districtId;
      let wardId = response.DT.wardId;
      let provinceName = response.DT.provinceName;
      let districtName = response.DT.districtName;
      let wardName = response.DT.wardName;
      let id = response.DT.id;
      let token = response.DT.access_token;
      let storeId = response.DT.storeId;
      let nameStore = response.DT.nameStore;
      let shipingUnitId = response.DT.shipingUnitId;
      let shipingUnitName = response.DT.shipingUnitName;
      let data = {
        isAuthenticated: true,
        token: token,
        account: { groupWithRoles, email, phonenumber, username, provinceName, districtName, wardName, provinceId, districtId, wardId, id, storeId, nameStore, shipingUnitId, shipingUnitName },
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

  const handleUpdateUserInfo = async (updatedInfo) => {
    try {
      const response = await editProfile(updatedInfo);
      if (response && response.EC === 0) {
        updateUserInfo(updatedInfo);
        console.log("User info updated successfully!");
      } else {
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext, updateUserInfo, handleUpdateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
