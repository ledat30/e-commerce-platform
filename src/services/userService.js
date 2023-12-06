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

const getAllUsers = (page, limit) => {
  return axios.get(
    `/api/user/read?page=${page}&limit=${limit}` //template string
  );
};

const updateUser = (userData) => {
  return axios.put(`/api/user/update`, { ...userData });
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

export {
  fetchRoles,
  fetchGroups,
  createNewUser,
  getAllUsers,
  updateUser,
  deleteUser,
  searchUsers,
  loginUser,
  getUserAccount,
};
