import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../api";

// ------------------------------
// Local storage helpers
// ------------------------------
const saveAuthToStorage = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

const clearAuthFromStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// ------------------------------
// Initial state
// ------------------------------
const userFromStorage = (() => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
})();

const tokenFromStorage = localStorage.getItem("token") || null;

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  loading: false,
  error: null,
};

// =====================
// Signup + auto-login
// =====================
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (userData, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // Safely parse JSON
      const data = await res.json().catch(() => ({}));
      console.log("Signup response:", data);

      if (!res.ok) throw new Error(data.message || "Signup failed");
      if (!data.user || !data.token)
        throw new Error("Invalid server response. Missing user or token.");

      saveAuthToStorage(data.user, data.token);
      return data; // { user, token }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Signup failed");
    }
  }
);

// =====================
// Login
// =====================
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      console.log("Login response:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");
      if (!data.user || !data.token)
        throw new Error("Invalid server response. Missing user or token.");

      saveAuthToStorage(data.user, data.token);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Login failed");
    }
  }
);

// =====================
// Slice
// =====================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      clearAuthFromStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
