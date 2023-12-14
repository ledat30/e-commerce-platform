import axios from "../setup/axios";

const createShippingUnit = (data) => {
  return axios.post(`/api/shipping-unit/create`, data);
};

const getAllShippingUnit = (page, limit) => {
  return axios.get(`/api/shipping-unit/read?page=${page}&limit=${limit}`);
};

const deleteShippingUnit = (shippingUnit) => {
  return axios.delete(`/api/shipping-unit/delete`, {
    data: { id: shippingUnit.id },
  });
};

const searchShippingUnit = (key) => {
  return axios.get(`/api/search/shipping-unit?q=${key}`);
};

export {
  createShippingUnit,
  getAllShippingUnit,
  deleteShippingUnit,
  searchShippingUnit,
};
