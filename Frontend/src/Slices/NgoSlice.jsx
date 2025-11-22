import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchNgoProfile = createAsyncThunk(
  "ngo/fetchNgoProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/ngo/profile", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const ngoSlice = createSlice({
  name: "ngo",
  initialState: {
    data: [],
    errors: null,
    loading: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNgoProfile.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchNgoProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.errors = null;
      })
      .addCase(fetchNgoProfile.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      });
  },
});
export default ngoSlice.reducer;
