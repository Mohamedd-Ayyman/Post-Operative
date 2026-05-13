import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { me } from '../store/authSlice';

export const useAuth = () => {
  const { user, token, loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  useEffect(() => { if (token && !user) dispatch(me()); }, [token, user, dispatch]);
  return { user, token, loading, isAuthenticated: !!user };
};