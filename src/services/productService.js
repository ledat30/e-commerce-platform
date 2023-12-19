import axios from "../setup/axios";

const getAllProductsByStore = (data) => {
  return axios.get(
    `/api/product/read?page=${data.page}&limit=${data.limit}&storeId=${data.storeId}`
  );
};

const createProduct = (productData) => {
  return axios.post(`/api/product/create`, {
    ...productData,
  });
};

const updateProduct = (productData) => {
  return axios.put(`/api/product/update`, { ...productData });
};

export { getAllProductsByStore, createProduct, updateProduct };
