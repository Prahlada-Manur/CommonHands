import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchAdminNgo = createAsyncThunk(
  "admin/fetchAdminNgo",
  async (
    { q = "", status = "All", page = 1, limit = 5 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/ngo/list", {
        headers: { Authorization: localStorage.getItem("token") },
        params: { q, status, page, limit },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);
export const AdminDeleteNgo = createAsyncThunk(
  "admin/AdminDeleteNgo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/ngo/admin/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log("deleted the ngo", response.data);

      return response?.data;
    } catch (err) {
      rejectWithValue(err?.response?.data?.error);
    }
  }
);
export const AdminVerifyNgo = createAsyncThunk(
  "admin/AdminVerifyNgo",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/ngo/verify/${id}`, formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);
export const AdminRejectNgo = createAsyncThunk(
  "admin/AdminRejectNgo",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/ngo/verify/${id}`, formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err?.response?.data?.error);
    }
  }
);
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchAdminUsers",
  async (undefined, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/user/list", {
        headers: { Authorization: localStorage.getItem("token") },
      });
    } catch (err) {
      console.log(err);
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    data: [],
    errors: null,
    loading: null,
    editId: null,
  },
  reducers: {
    assignEditId: (state, action) => {
      state.editId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminNgo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminNgo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.errors = null;
      })
      .addCase(fetchAdminNgo.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(AdminDeleteNgo.fulfilled, (state, action) => {
        const idx = state.data.ngoList.findIndex(
          (ele) => ele._id == action.payload._id
        );
        state.data.ngoList.splice(idx, 1);
        state.loading = false;
        state.errors = null;
      })
      .addCase(AdminDeleteNgo.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(AdminVerifyNgo.fulfilled, (state, action) => {
        const idx = state.data.ngoList.findIndex(
          (ele) => ele._id == action.payload._id
        );
        state.data.ngoList[idx] = action.payload;
        state.loading = false;
        state.errors = null;
        state.editId = null;
      })
      .addCase(AdminVerifyNgo.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(AdminRejectNgo.fulfilled, (state, action) => {
        const idx = state.data.ngoList.findIndex(
          (ele) => ele._id == action.payload._id
        );
        state.data.ngoList[idx] = action.payload;
        state.loading = false;
        state.errors = null;
        state.editId = null;
      })
      .addCase(AdminRejectNgo.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      });
  },
});
export default adminSlice.reducer;
export const { assignEditId } = adminSlice.actions;
