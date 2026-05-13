import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../store/predictionSlice';
import { CheckCircle, AlertTriangle, TrendingUp, Shield, Info } from 'lucide-react';

const riskColors = { normal: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle } };
const riskBg = { moderate: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: TrendingUp } };
const highBg = { high: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle } };
const all = { normal: riskColors.normal, moderate: riskBg.moderate, high: highBg.high };

export default function Results() {
  const dispatch = useDispatch();
  const { currentRecord } = useSelector((s) => s.prediction);

  useEffect(() => { if (!currentRecord) dispatch(fetchDashboard()); }, [currentRecord, dispatch]);

  const rec = currentRecord;
  if (!rec) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const risk = rec.prediction?.riskLevel || 'normal';
  const conf = rec.prediction?.confidence || 0;
  const probs = rec.prediction?.probabilities || {};
  const advice = rec.prediction?.advice || '';
  const s = all[risk] || all.normal;
  const Icon = s.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className={`card border-2 ${s.border} ${s.bg} p-8 text-center animate-fade-in`}>
          <div className={`w-20 h-20 ${s.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <Icon className={`w-10 h-10 ${s.text}`} />
          </div>
          <h2 className={`text-3xl font-extrabold ${s.text} mb-2`}>{risk.charAt(0).toUpperCase() + risk.slice(1)} Recovery</h2>
          <p className="text-gray-500 text-sm">Based on your check-in from {new Date(rec.createdAt).toLocaleString()}</p>
        </div>

        <div className="card mt-6 animate-fade-in stagger-1">
          <h3 className="font-semibold text-gray-900 mb-4">Risk Confidence</h3>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full transition-all duration-1000 ${risk === 'high' ? 'bg-red-500' : risk === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.round(conf * 100)}%` }} />
          </div>
          <p className="text-sm text-gray-500 text-right">{Math.round(conf * 100)}% confidence</p>
        </div>

        <div className="card mt-4 animate-fade-in stagger-2">
          <h3 className="font-semibold text-gray-900 mb-4">Probability Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(probs).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize font-medium text-gray-700">{k}</span>
                  <span className="font-bold text-gray-900">{Math.round(v * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${k === 'normal' ? 'bg-green-500' : k === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.round(v * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-4 animate-fade-in stagger-3">
          <div className="flex items-start gap-3">
            <Shield className={`w-5 h-5 mt-0.5 flex-shrink-0 ${s.text}`} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Medical Advice</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{advice}</p>
            </div>
          </div>
        </div>

        <div className="card mt-4 animate-fade-in stagger-4">
          <h3 className="font-semibold text-gray-900 mb-4">Submitted Data</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Pain Level', value: `${rec.painLevel}/10` },
              { label: 'Temperature', value: `${rec.temperature}°C` },
              { label: 'Redness', value: `${rec.redness}/4` },
              { label: 'Swelling', value: `${rec.swelling}/4` },
              { label: 'Discharge', value: rec.discharge },
              { label: 'Days Post-Surgery', value: rec.daysSinceSurgery },
            ].map((item) => (
              <div key={item.label} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-900 capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <a href="/dashboard" className="btn-primary flex-1 text-center">Back to Dashboard</a>
          <a href="/check-in" className="btn-secondary flex-1 text-center">New Check-In</a>
        </div>
      </div>
    </div>
  );
}