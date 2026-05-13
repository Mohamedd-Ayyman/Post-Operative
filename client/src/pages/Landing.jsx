import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Activity, Bell, BarChart3, ArrowRight, CheckCircle, Heart, TrendingUp } from 'lucide-react';

const features = [
  { icon: Activity, title: 'Daily Monitoring', desc: 'Track pain, temperature, redness, and other wound indicators every day.' },
  { icon: Shield, title: 'AI Risk Prediction', desc: 'RandomForest-powered infection risk analysis with 94% accuracy.' },
  { icon: Bell, title: 'Real-time Alerts', desc: 'Instant notifications when risk levels change or become critical.' },
  { icon: TrendingUp, title: 'Recovery Trends', desc: 'Visual charts showing your healing progress over time.' },
];

const stats = [
  { value: '94%', label: 'Prediction Accuracy' },
  { value: '<2s', label: 'Response Time' },
  { value: '24/7', label: 'Monitoring' },
  { value: '10+', label: 'Risk Factors' },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">PostOp Guard</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary !py-2 !px-5 !text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary !py-2 !px-5 !text-sm">Get Started</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
          <Shield className="w-4 h-4" />
          AI-Powered Healthcare Platform
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight animate-slide-up">
          Monitor Your Recovery.<br />
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Detect Infections Early.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-fade-in stagger-1">
          PostOp Guard helps post-surgical patients track recovery indicators and receive AI-powered infection risk assessments — all from a beautiful, intuitive dashboard.
        </p>
        <div className="flex gap-4 justify-center animate-fade-in stagger-2">
          <button onClick={() => navigate('/register')} className="btn-primary flex items-center gap-2 text-lg !px-8 !py-4">
            Start Free Today <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/login')} className="btn-secondary flex items-center gap-2 text-lg !px-8 !py-4">
            View Demo
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in stagger-3">
          {stats.map((s) => (
            <div key={s.label} className="card text-center">
              <div className="text-3xl font-extrabold text-blue-600">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need for Safe Recovery</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-hover group cursor-default">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-20">
        <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Health Data is Protected</h3>
              <p className="text-blue-100 text-sm">HIPAA-conscious architecture with encrypted storage</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Encrypted Data', 'JWT Auth', 'Role-Based Access', 'Audit Logs'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-blue-100 text-sm">
                <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>PostOp Guard &mdash; A Biomedical Data Analytics Project &copy; 2025</p>
      </footer>
    </div>
  );
}