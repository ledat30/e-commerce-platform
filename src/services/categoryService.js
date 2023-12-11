import axios from "../setup/axios";

const createCategory = (data) => {
  return axios.post(`/api/category/create`, data);
};

export { createCategory };
