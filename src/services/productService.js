import axios from "../setup/axios";

const getAllProductsByStore = (data) => {
  return axios.get(
    `/api/product/read?page=${data.page}&limit=${data.limit}&storeId=${data.storeId}`
  );
};
export { getAllProductsByStore };
