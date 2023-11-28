import { createStore } from "redux";

import rootReducer from "../reducer/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
//includes:reducer,middleware ...
const store = createStore(
  rootReducer,

  composeWithDevTools()
);

export default store;
