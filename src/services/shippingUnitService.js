import axios from "../setup/axios";

const createShippingUnit = (data) => {
  return axios.post(`/api/shipping-unit/create`, data);
};

const getAllShippingUnit = (page, limit) => {
  return axios.get(`/api/shipping-unit/read?page=${page}&limit=${limit}`);
};

export { createShippingUnit, getAllShippingUnit };
