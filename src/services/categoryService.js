import axios from "../setup/axios";

const createCategory = (data) => {
  return axios.post(`/api/category/create`, data);
};

const getAllCategories = (page, limit) => {
  return axios.get(`/api/category/read?page=${page}&limit=${limit}`);
};
const getAllCategory = () => {
  return axios.get(`/api/category/read`);
};

const updateCategory = (data) => {
  return axios.put(`/api/category/update`, data);
};

const deleteCategory = (category) => {
  return axios.delete(`/api/category/delete`, {
    data: { id: category.id },
  });
};

const searchCategory = (key) => {
  return axios.get(`/api/search-category?q=${key}`);
};

const getDetailCategoryById = (data) => {
  return axios.get(`/api/get-all-detail-category-by-id?id=${data.id}`);
};

export {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  searchCategory,
  getAllCategory,
  getDetailCategoryById,
};
