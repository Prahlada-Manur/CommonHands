import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../Slices/AdminSlice";
import ngoReducer from "../Slices/NgoSlice";

const createStore = () => {
  return configureStore({
    reducer: {
      admin: adminReducer,
      ngo: ngoReducer,
    },
  });
};
export default createStore;
