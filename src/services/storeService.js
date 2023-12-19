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

export {
  getAllStores,
  createStore,
  updateStore,
  deleteStore,
  searchStore,
  getAllStore,
};
