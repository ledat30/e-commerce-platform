import axios from "../setup/axios";

const createRole = (roles) => {
  return axios.post(`/api/role/create`, [...roles]);
};

const getAllRoles = (page, limit) => {
  return axios.get(`/api/role/read?page=${page}&limit=${limit}`);
};

const deleteRole = (role) => {
  return axios.delete(`/api/role/delete`, {
    data: { id: role.id },
  });
};

export { createRole, getAllRoles, deleteRole };
