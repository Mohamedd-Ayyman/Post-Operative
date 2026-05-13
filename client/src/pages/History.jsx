import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../store/predictionSlice';
import { History as HistoryIcon, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const riskIcons = { normal: CheckCircle, moderate: TrendingUp, high: AlertTriangle };
const riskColors = { normal: 'text-green-600', moderate: 'text-yellow-600', high: 'text-red-600' };
const riskBg = { normal: 'bg-green-50', moderate: 'bg-yellow-50', high: 'bg-red-50' };

export default function History() {
  const dispatch = useDispatch();
  const { history, currentPage, totalPages, loading } = useSelector((s) => s.prediction);

  useEffect(() => { dispatch(fetchHistory(1)); }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recovery History</h1>
            <p className="text-sm text-gray-500">All your check-in records</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {history.length === 0 ? (
          <div className="card text-center py-16">
            <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No records yet</h3>
            <p className="text-sm text-gray-400 mt-2">Complete your first check-in to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((rec, i) => {
              const risk = rec.prediction?.riskLevel || 'normal';
              const Icon = riskIcons[risk];
              return (
                <div key={rec._id} className={`card border-l-4 ${riskBg[risk].replace('bg-', 'border-l-')} border-gray-100 hover:shadow-md transition-all duration-200 animate-fade-in`}
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${riskBg[risk]} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${riskColors[risk]}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold uppercase tracking-wide ${riskColors[risk]}`}>{risk}</span>
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-sm text-gray-500">{Math.round((rec.prediction?.confidence || 0) * 100)}% confidence</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{new Date(rec.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-700">{rec.painLevel}</div>
                        <div className="text-xs text-gray-400">Pain</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-700">{rec.temperature}°</div>
                        <div className="text-xs text-gray-400">Temp</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-700">{rec.redness}/{rec.swelling}</div>
                        <div className="text-xs text-gray-400">Red/Swell</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={() => dispatch(fetchHistory(currentPage - 1))} disabled={currentPage <= 1}
                  className="btn-secondary !py-2 !px-4 flex items-center gap-1 text-sm">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
                <button onClick={() => dispatch(fetchHistory(currentPage + 1))} disabled={currentPage >= totalPages}
                  className="btn-secondary !py-2 !px-4 flex items-center gap-1 text-sm">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}