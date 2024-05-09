import axios from "../setup/axios";

const getAllStores = (page, limit) => {
  return axios.get(`/api/store/read?page=${page}&limit=${limit}`);
};
const getAllStore = () => {
  return axios.get(`/api/store/read`);
};

const createStore = (storeData) => {
  return axios.post(`/api/store/create`, {
    ...storeData,
  });
};

const updateStore = (storeData) => {
  return axios.put(`/api/store/update`, { ...storeData });
};

const deleteStore = (store) => {
  return axios.delete(`/api/store/delete`, {
    data: { id: store.id },
  });
};

const searchStore = (key) => {
  return axios.get(`/api/search-store?q=${key}`);
};

const getAllProductByStoreId = (page, limit, storeId) => {
  return axios.get(
    `/api/store/all-product-by-store-id?page=${page}&limit=${limit}&storeId=${storeId}`
  );
}

const getCategoriesByStore = (storeId) => {
  return axios.get(
    `/api/store/category-by-store?storeId=${storeId}`
  );
}

export {
  getAllStores,
  getAllProductByStoreId,
  createStore,
  getCategoriesByStore,
  updateStore,
  deleteStore,
  searchStore,
  getAllStore,
};
