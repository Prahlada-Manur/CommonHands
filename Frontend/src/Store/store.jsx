import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../Slices/AdminSlice";
import ngoReducer from "../Slices/NgoSlice";
import taskReducer from "../Slices/TaskSlice";

const createStore = () => {
  return configureStore({
    reducer: {
      admin: adminReducer,
      ngo: ngoReducer,
      tasks: taskReducer,
    },
  });
};
export default createStore;
