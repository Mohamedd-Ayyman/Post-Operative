import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer, logout } from '../src/store/authSlice';
import { predictionReducer } from '../src/store/predictionSlice';

describe('Auth Slice', () => {
  it('should set credentials on login', () => {
    const state = { user: null, token: null, loading: false, error: null };
    const action = { type: 'auth/login/fulfilled', payload: { user: { id: '1', name: 'Jane' }, token: 'tok123' } };
    const next = authReducer(state, action);
    expect(next.user).toEqual({ id: '1', name: 'Jane' });
    expect(next.token).toBe('tok123');
    expect(next.loading).toBe(false);
  });

  it('should clear state on logout', () => {
    const state = { user: { id: '1' }, token: 'tok123', loading: false, error: null };
    const action = { type: 'auth/logout/fulfilled' };
    const next = authReducer(state, action);
    expect(next.user).toBeNull();
    expect(next.token).toBeNull();
  });
});

describe('Prediction Slice', () => {
  it('should set current record on submit', () => {
    const state = { history: [], currentRecord: null, trends: [], dashboard: null, adminStats: null, loading: false, error: null, totalPages: 1, currentPage: 1 };
    const record = { _id: 'r1', painLevel: 3, prediction: { riskLevel: 'normal' } };
    const action = { type: 'prediction/submit/fulfilled', payload: record };
    const next = predictionReducer(state, action);
    expect(next.currentRecord).toEqual(record);
    expect(next.loading).toBe(false);
  });

  it('should set history records', () => {
    const state = { history: [], currentRecord: null, trends: [], dashboard: null, adminStats: null, loading: false, error: null, totalPages: 1, currentPage: 1 };
    const action = { type: 'prediction/history/fulfilled', payload: { records: [{ _id: 'r1' }], pages: 3, page: 1 } };
    const next = predictionReducer(state, action);
    expect(next.history).toHaveLength(1);
    expect(next.totalPages).toBe(3);
  });
});