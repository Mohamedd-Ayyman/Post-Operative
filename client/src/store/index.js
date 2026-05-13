import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authStore';
import uiReducer from './uiStore';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});