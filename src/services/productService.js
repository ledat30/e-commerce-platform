import axios from "../setup/axios";

const getAllProductsByStore = (data) => {
  return axios.get(
    `/api/product/read?page=${data.page}&limit=${data.limit}&storeId=${data.storeId}`
  );
};

const getAllProducts = (data) => {
  return axios.get(
    `/api/all-product/read?page=${data.page}&limit=${data.limit}`
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

const deleteProduct = (product) => {
  return axios.delete(`/api/product/delete`, {
    data: { id: product.id },
  });
};

const searchProduct = (key) => {
  return axios.get(`/api/search-product?q=${key}`);
};

export {
  getAllProductsByStore,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getAllProducts,
};
