import {
  FETCH_STORE_REQUEST,
  FETCH_STORE_SUCCESS,
  FETCH_STORE_ERROR,
  UPDATE_STORE_LIST,
} from "./types";
import { getAllStores } from "../../services/storeService";

export const fetchAllStores = (page, limit) => {
  return async (dispatch, getState) => {
    dispatch(fetchStoreRequest());
    try {
      const response = await getAllStores(page, limit);
      const data = response && response.DT.stores ? response.DT.stores : [];
      dispatch(fetchStoreSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(fetchStoreError());
    }
  };
};

export const fetchStoreRequest = () => {
  return {
    type: FETCH_STORE_REQUEST,
  };
};

export const fetchStoreSuccess = (data) => {
  return {
    type: FETCH_STORE_SUCCESS,
    dataStore: data,
  };
};

export const fetchStoreError = () => {
  return {
    type: FETCH_STORE_ERROR,
  };
};

export const updateStoreList = (newList) => ({
  type: UPDATE_STORE_LIST,
  payload: newList,
});
