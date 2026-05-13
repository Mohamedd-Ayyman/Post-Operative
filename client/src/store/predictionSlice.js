import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'https://hopeful-hope-production-c757.up.railway.app/api';
const getToken = () => localStorage.getItem('token');
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const submitCheckIn = createAsyncThunk('prediction/submit', async (data, { rejectWithValue }) => {
  try {
    const { data: result } = await axios.post(`${API}/prediction`, data, config());
    return result;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Submission failed'); }
});

export const fetchHistory = createAsyncThunk('prediction/history', async (page = 1, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/prediction/history?page=${page}&limit=20`, config());
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Failed to fetch history'); }
});

export const fetchTrends = createAsyncThunk('prediction/trends', async (days = 30, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/prediction/trends?days=${days}`, config());
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Failed to fetch trends'); }
});

export const fetchDashboard = createAsyncThunk('prediction/dashboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/analytics/dashboard`, config());
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Failed to fetch dashboard'); }
});

export const fetchAdminStats = createAsyncThunk('prediction/adminStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API}/analytics/admin`, config());
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.error || 'Failed to fetch stats'); }
});

const predictionSlice = createSlice({
  name: 'prediction',
  initialState: { history: [], currentRecord: null, trends: [], dashboard: null, adminStats: null, loading: false, error: null, totalPages: 1, currentPage: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitCheckIn.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(submitCheckIn.fulfilled, (s, a) => { s.loading = false; s.currentRecord = a.payload; })
      .addCase(submitCheckIn.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchHistory.fulfilled, (s, a) => { s.history = a.payload.records; s.totalPages = a.payload.pages; s.currentPage = a.payload.page; })
      .addCase(fetchTrends.fulfilled, (s, a) => { s.trends = a.payload; })
      .addCase(fetchDashboard.fulfilled, (s, a) => { s.dashboard = a.payload; })
      .addCase(fetchAdminStats.fulfilled, (s, a) => { s.adminStats = a.payload; });
  },
});
export const predictionReducer = predictionSlice.reducer;