// src/features/departmentTicketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../api";

const BASE_URL = `${API_URL}/tickets`;
const getToken = () => localStorage.getItem("token");

// =============================
// 🧩 Async Thunks
// =============================

// Fetch tickets assigned to department
export const fetchDepartmentTickets = createAsyncThunk(
  "departmentTickets/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`${BASE_URL}/department`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Update ticket status
export const updateTicketStatus = createAsyncThunk(
  "departmentTickets/updateStatus",
  async ({ ticketId, status }, thunkAPI) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`${BASE_URL}/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      return data.ticket;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// =============================
// 🧠 Slice
// =============================
const departmentTicketSlice = createSlice({
  name: "departmentTickets",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearDepartmentTicketState: (state) => {
      state.tickets = [];
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tickets
      .addCase(fetchDepartmentTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchDepartmentTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update ticket status
      .addCase(updateTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Ticket status updated successfully";

        // Update ticket in state
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// =============================
// 🚀 Exports
// =============================
export const { clearDepartmentTicketState } = departmentTicketSlice.actions;
export default departmentTicketSlice.reducer;
