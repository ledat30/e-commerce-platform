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

const storeDashboard = (storeId) => {
  return axios.get(
    `/api/store/dashboard-summary-by-store?storeId=${storeId}`
  );
}

const storeDashboardOrder = (page, limit, storeId) => {
  return axios.get(
    `/api/store/dashboard-order-by-store?page=${page}&limit=${limit}&storeId=${storeId}`
  );
}

const storeDashboardRevenue = (page, limit, storeId) => {
  return axios.get(
    `/api/store/dashboard-revenue-by-store?page=${page}&limit=${limit}&storeId=${storeId}`
  );
}

const storeDashboardRevenueByDate = (page, limit, storeId, date) => {
  return axios.get(
    `/api/store/dashboard-revenue-by-date?page=${page}&limit=${limit}&storeId=${storeId}&date=${date}`
  );
}

export {
  getAllStores,
  getAllProductByStoreId,
  storeDashboardOrder,
  storeDashboardRevenueByDate,
  storeDashboardRevenue,
  createStore,
  storeDashboard,
  getCategoriesByStore,
  updateStore,
  deleteStore,
  searchStore,
  getAllStore,
};
