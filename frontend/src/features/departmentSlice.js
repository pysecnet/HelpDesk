import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../api";

const DEPTS_BASE = `${API_URL}/departments`;
const getToken = () => localStorage.getItem("token");

// =============================
// 🧩 Async Thunks
// =============================

export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      
      const res = await fetch(DEPTS_BASE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // ✅ Include auth token
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch departments");
      }

      console.log("✅ Departments fetched:", data); // Debug log
      
      // ✅ Backend returns { departments: [...] }
      return data.departments || [];
    } catch (err) {
      console.error("❌ Fetch Departments Error:", err);
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch departments"
      );
    }
  }
);

// =============================
// 🧠 Slice
// =============================
const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    departments: [], // ✅ Always an array
    loading: false,
    error: null,
  },
  reducers: {
    clearDepartments: (state) => {
      state.departments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Ensure it's always an array
        state.departments = Array.isArray(action.payload) ? action.payload : [];
        console.log("✅ Departments stored in state:", state.departments);
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.departments = []; // ✅ Reset to empty array on error
      });
  },
});

export const { clearDepartments } = departmentSlice.actions;
export default departmentSlice.reducer;
