import axios from "../setup/axios";

const getAllStores = (page, limit) => {
  return axios.get(`/api/store/read?page=${page}&limit=${limit}`);
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

export { getAllStores, createStore, updateStore, deleteStore };
