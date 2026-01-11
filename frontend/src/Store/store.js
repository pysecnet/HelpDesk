// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import ticketReducer from "../features/ticketSlice";
import departmentReducer from "../features/departmentSlice";
import departmentTicketReducer from "../features/departmentTicketSlice"; // 🆕 Import

export const store = configureStore({
  reducer: {
    user: userReducer, // stores user info for app use
    tickets: ticketReducer, // manages student/admin tickets
    departments: departmentReducer, // manages department list (admin)
    departmentTickets: departmentTicketReducer, // 🆕 manages dept-side tickets
  },
});

export default store;
