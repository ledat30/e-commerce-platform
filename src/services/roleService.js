import axios from "../setup/axios";

const createRole = (roles) => {
  return axios.post(`/api/role/create`, [...roles]);
};

export { createRole };
