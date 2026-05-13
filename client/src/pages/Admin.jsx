import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../store/predictionSlice';
import { Users, Activity, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

export default function Admin() {
  const dispatch = useDispatch();
  const { adminStats } = useSelector((s) => s.prediction);

  useEffect(() => { dispatch(fetchAdminStats()); }, [dispatch]);

  const stats = [
    { icon: Users, label: 'Total Users', value: adminStats?.totalUsers || 0, color: 'blue' },
    { icon: Activity, label: 'Total Check-Ins', value: adminStats?.totalRecords || 0, color: 'teal' },
    { icon: AlertTriangle, label: 'High Risk Cases', value: adminStats?.highRiskCount || 0, color: 'red' },
    { icon: TrendingUp, label: 'Moderate Risk', value: adminStats?.moderateCount || 0, color: 'yellow' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">System overview and high-risk monitoring</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-hover">
              <div className={`w-10 h-10 bg-${s.color}-50 rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 text-${s.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {adminStats?.recentHighRisk?.length > 0 && (
          <div className="card mt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-900">High Risk Cases</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Patient</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Pain</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Temp</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {adminStats.recentHighRisk.map((rec) => (
                    <tr key={rec._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-medium text-gray-900">{rec.user?.name || 'Unknown'}</td>
                      <td className="py-3 px-2 text-gray-500">{new Date(rec.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-2">{rec.painLevel}/10</td>
                      <td className="py-3 px-2">{rec.temperature}°C</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          {Math.round((rec.prediction?.confidence || 0) * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}