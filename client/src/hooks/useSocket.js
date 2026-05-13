import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (userId) => {
  const socketRef = useRef(null);
  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('token');
    const socket = io('/', { auth: { token }, transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    return () => socket.disconnect();
  }, [userId]);
  return socketRef;
};