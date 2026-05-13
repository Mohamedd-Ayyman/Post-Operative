import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = '/api';

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API}/auth/login`, creds);
    localStorage.setItem('token', data.token);
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Login failed'); }
});

export const register = createAsyncThunk('auth/register', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API}/auth/register`, creds);
    localStorage.setItem('token', data.token);
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Registration failed'); }
});

export const me = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token');
    const { data } = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Auth failed'); }
});

export const logout = createAsyncThunk('auth/logout', () => {
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(me.pending, (s) => { s.loading = true; })
      .addCase(me.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(me.rejected, (s) => { s.loading = false; s.user = null; s.token = null; })
      .addCase(logout.fulfilled, (s) => { s.user = null; s.token = null; });
  },
});
export const authReducer = authSlice.reducer;