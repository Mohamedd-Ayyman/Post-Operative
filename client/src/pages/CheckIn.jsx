import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitCheckIn } from '../store/predictionSlice';
import { Activity, Thermometer, AlertTriangle, ArrowRight, Loader } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { id: 'vitals', label: 'Vitals' },
  { id: 'wound', label: 'Wound' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'review', label: 'Review' },
];

export default function CheckIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.prediction);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    painLevel: 0, temperature: 37.0, redness: 0, swelling: 0,
    discharge: 'none', daysSinceSurgery: 1, activityLevel: 'moderate',
    smoking: false, diabetes: false, notes: '',
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    const result = await dispatch(submitCheckIn(form));
    if (!result.error) {
      toast.success('Check-in submitted! Analyzing your risk...');
      navigate('/check-in/result');
    } else {
      toast.error(result.error || 'Submission failed');
    }
  };

  const PainSlider = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="label !mb-0">Pain Level</label>
        <span className={`text-3xl font-bold ${form.painLevel >= 7 ? 'text-red-500' : form.painLevel >= 4 ? 'text-yellow-500' : 'text-green-500'}`}>{form.painLevel}</span>
      </div>
      <input type="range" min="0" max="10" step="1" value={form.painLevel}
        onChange={(e) => update('painLevel', +e.target.value)}
        className="w-full h-3 rounded-full appearance-none cursor-pointer" />
      <div className="flex justify-between text-xs text-gray-400">
        <span>No pain</span><span>Moderate</span><span>Worst</span>
      </div>
    </div>
  );

  const TempInput = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="label !mb-0">Body Temperature (°C)</label>
        <span className={`text-lg font-bold ${form.temperature >= 38.5 ? 'text-red-500' : form.temperature >= 37.5 ? 'text-yellow-500' : 'text-green-500'}`}>{form.temperature}°C</span>
      </div>
      <input type="range" min="35.5" max="41" step="0.1" value={form.temperature}
        onChange={(e) => update('temperature', +e.target.value)} className="w-full h-3" />
      {form.temperature >= 38.5 && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl text-sm">
          <AlertTriangle className="w-4 h-4" /> High fever detected. Consider contacting your doctor.
        </div>
      )}
    </div>
  );

  const WoundRating = ({ label, value, onChange }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="label !mb-0">{label}</label>
        <span className="text-lg font-bold text-gray-700">{value}/4</span>
      </div>
      <input type="range" min="0" max="4" step="1" value={value} onChange={(e) => onChange(+e.target.value)} className="w-full h-3" />
      <div className="flex justify-between text-xs text-gray-400">
        <span>None</span><span>Mild</span><span>Moderate</span><span>Severe</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Daily Recovery Check-In</h1>
          <p className="text-sm text-gray-500 mt-1">Track your symptoms to help detect infections early</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${i === step ? 'bg-blue-600 text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`} onClick={() => i <= step && setStep(i)}>
                {i < step ? '✓' : i + 1} {s.label}
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-1 rounded-full ${i < step ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card animate-fade-in">
          {step === 0 && (
            <div className="space-y-6">
              <PainSlider />
              <div className="border-t border-gray-100 pt-6"><TempInput /></div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <WoundRating label="Redness" value={form.redness} onChange={(v) => update('redness', v)} />
              <div className="border-t border-gray-100 pt-6"><WoundRating label="Swelling" value={form.swelling} onChange={(v) => update('swelling', v)} /></div>
              <div className="border-t border-gray-100 pt-6">
                <label className="label">Discharge Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['none', 'mild', 'moderate', 'severe'].map((d) => (
                    <button key={d} onClick={() => update('discharge', d)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium capitalize transition-all ${form.discharge === d ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="label">Days Since Surgery</label>
                <input type="number" min="0" className="input-field" value={form.daysSinceSurgery} onChange={(e) => update('daysSinceSurgery', +e.target.value)} />
              </div>
              <div>
                <label className="label">Activity Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['bedridden', 'low', 'moderate', 'normal'].map((a) => (
                    <button key={a} onClick={() => update('activityLevel', a)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium capitalize transition-all ${form.activityLevel === a ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <label className="label">Medical History</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'smoking', label: 'Smoking', desc: 'Currently smoking' },
                    { key: 'diabetes', label: 'Diabetes', desc: 'Has diabetes diagnosis' },
                  ].map((item) => (
                    <button key={item.key} onClick={() => update(item.key, !form[item.key])}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${form[item.key] ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`text-sm font-semibold ${form[item.key] ? 'text-blue-700' : 'text-gray-700'}`}>{item.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Review Your Check-In</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Pain Level', value: `${form.painLevel}/10` },
                  { label: 'Temperature', value: `${form.temperature}°C` },
                  { label: 'Redness', value: `${form.redness}/4` },
                  { label: 'Swelling', value: `${form.swelling}/4` },
                  { label: 'Discharge', value: form.discharge },
                  { label: 'Days Post-Surgery', value: form.daysSinceSurgery },
                  { label: 'Activity', value: form.activityLevel },
                  { label: 'Smoking', value: form.smoking ? 'Yes' : 'No' },
                  { label: 'Diabetes', value: form.diabetes ? 'Yes' : 'No' },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-900 capitalize">{item.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <label className="label">Notes (optional)</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Any additional symptoms or concerns..."
                  value={form.notes} onChange={(e) => update('notes', e.target.value)} />
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 !py-4 text-base">
                {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</> : <><Activity className="w-5 h-5" /> Submit & Predict Risk</>}
              </button>
            </div>
          )}

          {step < 3 && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">Back</button>}
              <button onClick={() => setStep(step + 1)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}