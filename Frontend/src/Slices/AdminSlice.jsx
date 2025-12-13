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
  async (
    { q = "", role = "All", page = 1, limit = 5 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/user/list", {
        params: { q, role, page, limit },
        headers: { Authorization: localStorage.getItem("token") },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);
export const AdminDeleteUser = createAsyncThunk(
  "admin/AdminDeleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/user/delete/${id}`, {
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
export const fetchAdminTasks = createAsyncThunk(
  "admin/fetchAdminTasks",
  async (
    { q = "", type = "All", status = "All", page = 1, limit = 5 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/admin/tasks", {
        params: { q, status, type, page, limit },
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
export const AdminDeleteTask = createAsyncThunk(
  "admin/AdminDeleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/task/${id}`, {
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
export const fetchAdminApplication = createAsyncThunk(
  "admin/fetchAdminApplication",
  async (
    { q = "", status = "All", page = 1, limit = 5 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/admin/applications", {
        headers: { Authorization: localStorage.getItem("token") },
        params: { q, status, page, limit },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);
export const AdminDeleteApplication = createAsyncThunk(
  "admin/AdminDeleteApplication",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/application/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response?.data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err?.response?.data?.error);
    }
  }
);
export const AdminStats = createAsyncThunk(
  "admin/AdminStats",
  async (undefined, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/stats", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data?.error);
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
    resetAdminData: (state) => {
      state.data = [];
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
          (ele) => ele._id == action.payload.ngoToDelete._id
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
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        (state.loading = false), (state.data = action.payload);
        state.errors = null;
      })
      .addCase(AdminDeleteUser.fulfilled, (state, action) => {
        const idx = state.data.userList.findIndex(
          (ele) => ele._id == action.payload._id
        );
        state.data.userList.splice(idx, 1);
        (state.errors = null), (state.loading = false);
      })
      .addCase(AdminDeleteUser.rejected, (state, action) => {
        (state.errors = action.payload), (state.loading = false);
      })
      .addCase(fetchAdminTasks.pending, (state) => {
        (state.loading = true), (state.errors = null);
      })
      .addCase(fetchAdminTasks.fulfilled, (state, action) => {
        (state.data = action.payload),
          (state.errors = null),
          (state.loading = false);
      })
      .addCase(fetchAdminTasks.rejected, (state, action) => {
        (state.errors = action.payload), (state.loading = false);
      })
      .addCase(AdminDeleteTask.fulfilled, (state, action) => {
        const idx = state?.data?.tasks?.findIndex(
          (ele) => ele._id == action.payload._id
        );
        state?.data?.tasks?.splice(idx, 1);
        state.errors = null;
        state.loading = false;
      })
      .addCase(AdminDeleteTask.rejected, (state, action) => {
        (state.errors = action.payload), (state.loading = false);
      })
      .addCase(fetchAdminApplication.pending, (state) => {
        (state.loading = false), (state.errors = null);
      })
      .addCase(fetchAdminApplication.fulfilled, (state, action) => {
        (state.data = action.payload),
          (state.loading = false),
          (state.errors = null);
      })
      .addCase(fetchAdminApplication.rejected, (state, action) => {
        (state.loading = false), (state.errors = action.payload);
      })
      .addCase(AdminDeleteApplication.fulfilled, (state, action) => {
        const idx = state.data?.applications?.findIndex(
          (ele) => ele._id == action.payload.deletedId
        );
        state.data?.applications?.splice(idx, 1);
        state.errors = null;
      })
      .addCase(AdminDeleteApplication.rejected, (state, action) => {
        (state.errors = action.payload), (state.loading = false);
      })
      .addCase(AdminStats.pending, (state) => {
        (state.loading = true), (state.errors = null);
      })
      .addCase(AdminStats.fulfilled, (state, action) => {
        (state.data = action.payload),
          (state.errors = null),
          (state.loading = false);
      })
      .addCase(AdminStats.rejected, (state, action) => {
        (state.loading = false), (state.errors = action.payload);
      });
  },
});
export default adminSlice.reducer;
export const { assignEditId, resetAdminData } = adminSlice.actions;
