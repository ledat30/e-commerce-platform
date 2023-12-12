import {
  FETCH_STORE_REQUEST,
  FETCH_STORE_SUCCESS,
  FETCH_STORE_ERROR,
} from "../action/types";

const INITIAL_STATE = {
  listStores: [],
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_STORE_REQUEST:
      return {
        ...state,
      };

    case FETCH_STORE_SUCCESS:
      return {
        ...state,
        listStores: action.dataStore,
      };

    case FETCH_STORE_ERROR:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default userReducer;
