import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { Activity, LayoutDashboard, PlusSquare, History, Shield, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/check-in', label: 'Check-In', icon: PlusSquare },
  { to: '/history', label: 'History', icon: History },
];

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  if (['/', '/login', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">PostOp Guard</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === link.to ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            {(user?.role === 'admin' || user?.role === 'doctor') && (
              <Link to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === '/admin' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-400 capitalize">{user?.role}</span>
            </div>
            <button onClick={() => dispatch(logout())} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Sign Out">
              <LogOut className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium border-b border-gray-50 ${location.pathname === link.to ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
              <link.icon className="w-4 h-4" /> {link.label}
            </Link>
          ))}
          {(user?.role === 'admin' || user?.role === 'doctor') && (
            <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-6 py-3 text-sm font-medium border-b border-gray-50 text-gray-600">
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}