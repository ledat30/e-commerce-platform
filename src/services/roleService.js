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

const searchRole = (key) => {
  return axios.get(`/api/search-role?q=${key}`);
};

const getRoleByGroup = (groupId) => {
  return axios.get(`/api/role/by-group/${groupId}`);
};

const assignRoleToGroup = (data) => {
  return axios.post(`/api/role/assign-to-group`, { data });
};

export {
  createRole,
  getAllRoles,
  deleteRole,
  searchRole,
  getRoleByGroup,
  assignRoleToGroup,
};
