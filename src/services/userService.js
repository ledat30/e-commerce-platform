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

const deleteUser = (user) => {
  return axios.delete(`/api/user/delete`, {
    data: { id: user.id },
  });
};

export { fetchRoles, createNewUser, getAllUsers, deleteUser };
