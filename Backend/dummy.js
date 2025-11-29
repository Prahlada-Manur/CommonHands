const handleDelete = async (id) => {
    if (!window.confirm("Delete this NGO?")) return;

    try {
        // Wait for delete to finish COMPLETELY before anything else
        await dispatch(AdminDeleteNgo(id)).unwrap();

        if (ngoList.length === 1 && page > 1) {
            setPage(page - 1);  // useEffect will auto refetch
        } else {
            // normal case: just refetch current page
            dispatch(fetchAdminNgo({ q: search, status: statusFilter, page, limit }));
        }

    } catch (err) {
        console.error("Delete failed:", err);
    }
};
//-------------------------------------------------------------------------------------
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
                // const ngo = action.payload.ngoToDelete;

                const idx = state.data.ngoList.findIndex((ele) => ele._id == action.payload.ngoToDelete._id);
                state.data.ngoList.splice(idx, 1);

                // state.data.stats.total -= 1;

                // if (ngo.status === "Pending") state.data.stats.pending -= 1;
                // if (ngo.status === "Verified") state.data.stats.verified -= 1;
                // if (ngo.status === "Rejected") state.data.stats.rejected -= 1;

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
                // const oldStatus = state.data.ngoList[idx].status;
                // state.data.ngoList[idx] = action.payload;
                // if (oldStatus === "Pending") state.data.stats.pending -= 1;
                // if (oldStatus === "Rejected") state.data.stats.rejected -= 1;
                // state.data.stats.verified += 1;
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
                const oldStatus = state.data.ngoList[idx].status;
                state.data.ngoList[idx] = action.payload;
                // if (oldStatus === "Pending") state.data.stats.pending -= 1;
                // if (oldStatus === "Verified") state.data.stats.verified -= 1;
                // state.data.stats.rejected += 1;
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
            });
    },
});
export default adminSlice.reducer;
export const { assignEditId } = adminSlice.actions;
