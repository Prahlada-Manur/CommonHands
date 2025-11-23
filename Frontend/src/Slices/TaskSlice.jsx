import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    errors: null,
    loading: null,
  },
  extraReducers: (builder) => {
    builder;
  },
});
export default taskSlice.reducer;
