import axios from "../setup/axios";

const createCategory = (data) => {
  return axios.post(`/api/category/create`, data);
};

const getAllCategories = (page, limit) => {
  return axios.get(`/api/category/read?page=${page}&limit=${limit}`);
};

const updateCategory = (data) => {
  return axios.put(`/api/category/update`, data);
};

export { createCategory, getAllCategories, updateCategory };
