import axios from "../setup/axios";

const fetchRoles = () => {
  return axios.get(`/api/role/read`);
};

const fetchGroups = () => {
  return axios.get(`/api/group/read`);
};

const createNewUser = (userData) => {
  return axios.post(`/api/user/create`, {
    ...userData,
  });
};

const registerUser = (data) => {
  return axios.post(`/api/user/register`, data);
}

const getAllUsers = (page, limit) => {
  return axios.get(
    `/api/user/read?page=${page}&limit=${limit}` //template string
  );
};

const updateUser = (userData) => {
  return axios.put(`/api/user/update`, { ...userData });
};

const editProfile = (data) => {
  return axios.put(`/api/user/edit-profile`, data);
};

const deleteUser = (user) => {
  return axios.delete(`/api/user/delete`, {
    data: { id: user.id },
  });
};

const searchUsers = (key) => {
  return axios.get(`/api/search-user?q=${key}`);
};

const loginUser = (valueLogin, password) => {
  return axios.post("http://localhost:8080/api/login", {
    valueLogin,
    password,
  });
};

const getUserAccount = () => {
  return axios.get(`/api/account`);
};

const logoutUser = () => {
  return axios.post(`/api/logout`);
};

const getGroupStore = () => {
  return axios.get(`/api/user-group-store`);
};

const groupShippingUnitFunc = () => {
  return axios.get(`/api/user-group-shipping_unit`);
}

const getGroupShipper = () => {
  return axios.get(`/api/user-group-shipper`);
};

export {
  fetchRoles,
  fetchGroups,
  createNewUser,
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
  searchUsers,
  loginUser,
  getUserAccount,
  logoutUser,
  getGroupStore,
  groupShippingUnitFunc,
  editProfile,
  getGroupShipper,
};
