import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    data:[],
    errors:null,
    loading:null
  },
  extraReducers:(builder)=>{
    builder
  }
});
export default adminSlice.reducer;