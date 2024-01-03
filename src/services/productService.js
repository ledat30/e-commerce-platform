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

const createProduct = (productData, storeId) => {
  return axios.post(`/api/product/create?storeId=${storeId}`, {
    ...productData,
  });
};

const updateProduct = (productData, storeId) => {
  return axios.put(`/api/product/update?storeId=${storeId}`, {
    ...productData,
  });
};

const deleteProduct = (product) => {
  return axios.delete(`/api/product/delete`, {
    data: { id: product.id },
  });
};

const searchProduct = (key) => {
  return axios.get(`/api/search-product?q=${key}`);
};

const getAllProductsInStockByStore = (data) => {
  return axios.get(
    `/api/inventory/read?page=${data.page}&limit=${data.limit}&storeId=${data.storeId}`
  );
};

export {
  getAllProductsByStore,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getAllProducts,
  getAllProductsInStockByStore,
};
