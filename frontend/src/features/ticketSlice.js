// src/features/ticketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../api";

const getToken = () => localStorage.getItem("token");

// ------------------------------
// Add Ticket (Student only)
// ------------------------------
export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create ticket");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// Fetch My Tickets (Student)
// ------------------------------
export const fetchMyTickets = createAsyncThunk(
  "tickets/fetchMyTickets",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// Fetch All Tickets (Admin)
// ------------------------------
export const fetchAdminTickets = createAsyncThunk(
  "tickets/fetchAdminTickets",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// ✅ NEW: Fetch Single Ticket Details
// ------------------------------
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (ticketId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch ticket");
      return data.ticket;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// Fetch Department Tickets (Department Admin)
// ------------------------------
export const fetchDepartmentTickets = createAsyncThunk(
  "tickets/fetchDepartmentTickets",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/department`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch department tickets");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// Assign Ticket to Department (Admin)
// ------------------------------
export const assignTicket = createAsyncThunk(
  "tickets/assignTicket",
  async ({ ticketId, departmentId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/${ticketId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ departmentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign ticket");
      return data.ticket;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// Update Ticket Status (Admin/Department)
// ------------------------------
export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update ticket status");
      return data.ticket;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// ✅ NEW: Update Ticket Priority
// ------------------------------
export const updateTicketPriority = createAsyncThunk(
  "tickets/updateTicketPriority",
  async ({ ticketId, priority }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/${ticketId}/priority`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update priority");
      return data.ticket;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// ✅ NEW: Add Comment
// ------------------------------
export const addComment = createAsyncThunk(
  "tickets/addComment",
  async ({ ticketId, message, isInternal }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, isInternal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add comment");
      return data.ticket;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// ✅ NEW: Upload Attachment
// ------------------------------
export const uploadAttachment = createAsyncThunk(
  "tickets/uploadAttachment",
  async ({ ticketId, file }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/tickets/${ticketId}/attachments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload file");
      return data.ticket;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// Get Ticket Statistics (Admin/Department)
// ------------------------------
export const fetchTicketStats = createAsyncThunk(
  "tickets/fetchTicketStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/tickets/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch ticket stats");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------
// Slice
// ------------------------------
const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    currentTicket: null, // ✅ NEW: For single ticket view
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },
    clearTickets: (state) => {
      state.tickets = [];
      state.currentTicket = null;
      state.stats = null;
      state.error = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ------------------------------
      // Add Ticket
      // ------------------------------
      .addCase(addTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload.ticket || action.payload);
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error creating ticket";
      })

      // ------------------------------
      // Fetch My Tickets
      // ------------------------------
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets || [];
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching tickets";
      })

      // ------------------------------
      // Fetch Admin Tickets
      // ------------------------------
      .addCase(fetchAdminTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets || [];
      })
      .addCase(fetchAdminTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching tickets";
      })

      // ------------------------------
      // ✅ NEW: Fetch Single Ticket
      // ------------------------------
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching ticket";
      })

      // ------------------------------
      // Fetch Department Tickets
      // ------------------------------
      .addCase(fetchDepartmentTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets || [];
      })
      .addCase(fetchDepartmentTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching department tickets";
      })

      // ------------------------------
      // Assign Ticket
      // ------------------------------
      .addCase(assignTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error assigning ticket";
      })

      // ------------------------------
      // Update Ticket Status
      // ------------------------------
      .addCase(updateTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating ticket status";
      })

      // ------------------------------
      // ✅ NEW: Update Priority
      // ------------------------------
      .addCase(updateTicketPriority.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicketPriority.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(updateTicketPriority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating priority";
      })

      // ------------------------------
      // ✅ NEW: Add Comment
      // ------------------------------
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error adding comment";
      })

      // ------------------------------
      // ✅ NEW: Upload Attachment
      // ------------------------------
      .addCase(uploadAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.currentTicket?._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(uploadAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error uploading file";
      })

      // ------------------------------
      // Fetch Ticket Stats
      // ------------------------------
      .addCase(fetchTicketStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTicketStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching ticket stats";
      });
  },
});

export const { clearTicketError, clearTickets, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;