import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchDashboard, fetchTrends } from '../store/predictionSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, History, BarChart3 } from 'lucide-react';

const riskColors = { normal: 'text-green-600', moderate: 'text-yellow-600', high: 'text-red-600' };
const riskBg = { normal: 'bg-green-50 border-green-200', moderate: 'bg-yellow-50 border-yellow-200', high: 'bg-red-50 border-red-200' };
const riskBadge = { normal: 'bg-green-100 text-green-700', moderate: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { dashboard, trends } = useSelector((s) => s.prediction);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { dispatch(fetchDashboard()); dispatch(fetchTrends(30)); }, [dispatch]);

  const lastRecord = dashboard?.lastRecord;
  const risk = lastRecord?.prediction?.riskLevel;

  const chartData = trends.map((t, i) => ({
    date: new Date(t.createdAt || t['prediction.createdAt']).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pain: t.painLevel,
    temp: t.temperature,
    redness: t.redness,
    swelling: t.swelling,
    idx: i,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-100 text-sm font-medium">Welcome back,</p>
          <h1 className="text-3xl font-bold mt-1">{user?.name || 'Patient'}</h1>
          <p className="text-blue-100 text-sm mt-1">Here's your recovery overview</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-6 space-y-6">
        {/* Risk Status */}
        <div className={`card border-2 ${riskBg[risk || 'normal']} animate-fade-in`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {risk === 'high' && <div className="relative"><div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center animate-pulse-glow"><AlertTriangle className="w-7 h-7 text-red-600" /></div></div>}
              {risk === 'moderate' && <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center"><TrendingUp className="w-7 h-7 text-yellow-600" /></div>}
              {(!risk || risk === 'normal') && <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center"><CheckCircle className="w-7 h-7 text-green-600" /></div>}
              <div>
                <p className="text-sm text-gray-500 font-medium">Current Risk Status</p>
                <p className={`text-2xl font-bold capitalize ${riskColors[risk || 'normal']}`}>{risk || 'Normal'}</p>
                {lastRecord && <p className="text-xs text-gray-400 mt-1">{new Date(lastRecord.createdAt).toLocaleString()}</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/check-in" className="btn-primary flex items-center gap-2 !px-6 !py-3 text-sm">
                <Plus className="w-4 h-4" /> New Check-In
              </Link>
              <Link to="/history" className="btn-secondary flex items-center gap-2 !px-6 !py-3 text-sm">
                <History className="w-4 h-4" /> History
              </Link>
            </div>
          </div>
          {lastRecord?.prediction?.probabilities && (
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              {Object.entries(lastRecord.prediction.probabilities).map(([k, v]) => (
                <div key={k} className="text-center">
                  <div className="text-lg font-bold text-gray-700">{Math.round(v * 100)}%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider capitalize">{k}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: 'Total Check-Ins', value: dashboard?.totalRecords || 0, color: 'blue' },
            { icon: Clock, label: 'Days Since Surgery', value: lastRecord?.daysSinceSurgery || '—', color: 'teal' },
            { icon: AlertTriangle, label: 'High Risk Alerts', value: dashboard?.notifications?.length || 0, color: 'red' },
            { icon: BarChart3, label: 'Data Points', value: trends.length || 0, color: 'purple' },
          ].map((s) => (
            <div key={s.label} className="card-hover cursor-default">
              <div className={`w-10 h-10 bg-${s.color}-50 rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 text-${s.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pain & Temperature Trend</h3>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full" /> Pain</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-full" /> Temp</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="pain" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="temp" stroke="#f87171" fill="#f87171" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Wound Indicators</h3>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-400 rounded-full" /> Redness</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-500 rounded-full" /> Swelling</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 4]} />
                <Tooltip />
                <Area type="monotone" dataKey="redness" stroke="#fb923c" fill="#fb923c" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="swelling" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Notifications */}
        {dashboard?.notifications?.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {dashboard.notifications.map((n) => (
                <div key={n._id} className={`p-4 rounded-xl border ${n.read ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${n.read ? 'text-gray-400' : 'text-blue-600'}`} />
                    <p className={`text-sm font-medium ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.title}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 ml-6">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}