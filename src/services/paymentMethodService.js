import axios from "../setup/axios";

const createPayment = (data) => {
  return axios.post(`/api/payment/create`, data);
};

const getAllPayment = (page, limit) => {
  return axios.get(`/api/payment/read?page=${page}&limit=${limit}`);
};

const getAllPaymentClient = () => {
  return axios.get(`/api/payment/read`);
}

const updatePayment = (data) => {
  return axios.put(`/api/payment/update`, data);
};

const deletePayment = (payment) => {
  return axios.delete(`/api/payment/delete`, {
    data: { id: payment.id },
  });
};

const searchPayment = (key) => {
  return axios.get(`/api/search-payment?q=${key}`);
};

export {
  createPayment,
  getAllPayment,
  getAllPaymentClient,
  updatePayment,
  deletePayment,
  searchPayment,
};
