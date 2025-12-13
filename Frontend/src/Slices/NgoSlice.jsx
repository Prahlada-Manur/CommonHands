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
      return response?.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);
export const fetchNgoDashboard = createAsyncThunk(
  "ngo/fetchNgoDashboard",
  async ({ status = "All", page = 1, limit = 5 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/tasks/dashboard?status=${status}&page=${page}&limit=${limit}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data?.error || err?.message);
    }
  }
);
export const fetchNgoTasks = createAsyncThunk(
  "ngo/fetchNgoTasks",
  async (
    { page = 1, limit = 5, status = "All", type = "All" } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/ngo/tasks?page=${page}&limit=${limit}&status=${status}&type=${type}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data?.error || err?.message);
    }
  }
);

const ngoSlice = createSlice({
  name: "ngo",
  initialState: {
    data: null,
    errors: null,
    loading: null,
  },
  reducers: {
    resetNgoData: (state) => {
      state.data = [];
    },
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
      })
      .addCase(fetchNgoDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNgoDashboard.fulfilled, (state, action) => {
        (state.data = action.payload),
          (state.loading = false),
          (state.errors = null);
      })
      .addCase(fetchNgoDashboard.rejected, (state, action) => {
        (state.errors = action.payload), (state.loading = false);
      })
      .addCase(fetchNgoTasks.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchNgoTasks.fulfilled, (state, action) => {
        (state.data = action.payload),
          (state.errors = null),
          (state.loading = false);
      })
      .addCase(fetchNgoTasks.rejected, (state, action) => {
        (state.errors = action.payload), (state.loading = false);
      });
  },
});
export default ngoSlice.reducer;
export const { resetNgoData } = ngoSlice.actions;
