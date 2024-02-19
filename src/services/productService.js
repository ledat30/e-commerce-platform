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

const deleteProductInStock = (product) => {
  return axios.delete(`/api/inventory/delete`, {
    data: { id: product.id },
  });
};

const updateProductInStockByStore = (data) => {
  return axios.put(`/api/inventory/update`, data);
};

const createColorProduct = (data) => {
  return axios.post(`/api/color/create`, data);
};

const getAllColorsProduct = (page, limit) => {
  return axios.get(`/api/color/read?page=${page}&limit=${limit}`);
};

const deleteColor = (color) => {
  return axios.delete(`/api/color/delete`, {
    data: { id: color.id },
  });
};

const updateColorProduct = (data) => {
  return axios.put(`/api/color/update`, data);
};

const createSizeProduct = (data) => {
  return axios.post(`/api/size/create`, data);
};

const getAllSizeProduct = (page, limit) => {
  return axios.get(`/api/size/read?page=${page}&limit=${limit}`);
};

const deleteSize = (color) => {
  return axios.delete(`/api/size/delete`, {
    data: { id: color.id },
  });
};

const updateSizeProduct = (data) => {
  return axios.put(`/api/size/update`, data);
};

export {
  getAllProductsByStore,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getAllProducts,
  getAllProductsInStockByStore,
  deleteProductInStock,
  updateProductInStockByStore,
  createColorProduct,
  getAllColorsProduct,
  deleteColor,
  updateColorProduct,
  createSizeProduct,
  getAllSizeProduct,
  deleteSize,
  updateSizeProduct,
};
