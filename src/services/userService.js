import axios from "../setup/axios";

const fetchRoles = () => {
  return axios.get(`/api/role/read`);
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

export { fetchRoles, createNewUser, getAllUsers };
