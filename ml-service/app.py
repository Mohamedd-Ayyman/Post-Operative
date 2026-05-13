from flask import Flask, request, jsonify
import numpy as np
import joblib
import os

app = Flask(__name__)
MODEL_PATH = os.environ.get('MODEL_PATH', 'model/rf_model.pkl')

def load_model():
    try:
        data = joblib.load(MODEL_PATH)
        if isinstance(data, tuple):
            return data[0], data[1]
        return data, None
    except Exception:
        return None, None

model, le = load_model()

cat_cols = ['L-CORE','L-SURF','L-O2','L-BP','SURF-STBL','CORE-STBL','BP-STBL']
core_map = {'low': 36.5, 'mid': 37.2, 'high': 38.1}
surf_map = {'low': 35.8, 'mid': 36.4, 'high': 37.0}
bp_map = {'low': 90, 'mid': 115, 'high': 140}
o2_map = {'low': 94, 'mid': 97, 'excellent': 99}
l_core_enc = {'low': 0, 'mid': 1, 'high': 2}
l_surf_enc = {'low': 0, 'mid': 1, 'high': 2}
l_o2_enc = {'low': 0, 'mid': 1, 'excellent': 2}
l_bp_enc = {'low': 0, 'mid': 1, 'high': 2}
surf_stbl_enc = {'stable': 0, 'mod-stable': 1, 'unstable': 2}
core_stbl_enc = {'stable': 0, 'unstable': 1}
bp_stbl_enc = {'stable': 0, 'mod-stable': 1, 'unstable': 2}
discharge_map = {'none': 0, 'mild': 1, 'moderate': 2, 'severe': 3}

def infer_l_core(temp):
    if temp < 36.8: return l_core_enc['low']
    if temp < 37.5: return l_core_enc['mid']
    return l_core_enc['high']

def infer_l_surf(temp):
    if temp < 36.2: return l_surf_enc['low']
    if temp < 36.8: return l_surf_enc['mid']
    return l_surf_enc['high']

def infer_l_bp(bp):
    if bp < 105: return l_bp_enc['low']
    if bp < 130: return l_bp_enc['mid']
    return l_bp_enc['high']

def infer_surf_stbl(swelling, redness):
    s = swelling + redness
    if s <= 2: return surf_stbl_enc['stable']
    if s <= 5: return surf_stbl_enc['mod-stable']
    return surf_stbl_enc['unstable']

def infer_core_stbl(pain, temp):
    score = 0
    if pain >= 7: score += 1
    if temp >= 38.5: score += 1
    return core_stbl_enc['unstable' if score >= 1 else 'stable']

def infer_bp_stbl(discharge, activity):
    score = 0
    if discharge in ['moderate', 'severe']: score += 1
    if activity == 'bedridden': score += 1
    if score >= 1: return bp_stbl_enc['unstable']
    if score == 1: return bp_stbl_enc['mod-stable']
    return bp_stbl_enc['stable']

def preprocess(data):
    bp = data.get('bp_systolic', data.get('temperature', 37) * 3 + 90)
    o2 = data.get('oxygen_sat', 97)
    comfort = min(15, max(5, int(15 - data.get('painLevel', 0) * 0.8 - (data.get('temperature', 37) - 37) * 2)))

    l_core = infer_l_core(data.get('temperature', 37))
    l_surf = infer_l_surf(data.get('temperature', 37) - 0.4)
    l_o2 = l_o2_enc['excellent' if o2 >= 98 else 'mid' if o2 >= 95 else 'low']
    l_bp = infer_l_bp(bp)
    surf_stbl = infer_surf_stbl(data.get('swelling', 0), data.get('redness', 0))
    core_stbl = infer_core_stbl(data.get('painLevel', 0), data.get('temperature', 37))
    bp_stbl = infer_bp_stbl(data.get('discharge', 'none'), data.get('activityLevel', 'moderate'))

    return np.array([[
        data.get('temperature', 37),
        data.get('temperature', 37) - 0.4,
        bp,
        o2,
        comfort,
        int(data.get('smoking', False)),
        int(data.get('diabetes', False)),
        data.get('redness', 0),
        data.get('swelling', 0),
        discharge_map.get(data.get('discharge', 'none'), 0),
        l_core,
        l_surf,
        l_o2,
        l_bp,
        surf_stbl,
        core_stbl,
        bp_stbl,
    ]])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if model:
            X = preprocess(data)
            pred = model.predict(X)[0]
            proba = model.predict_proba(X)[0]
            prob_dict = {l: round(float(p), 4) for l, p in zip(model.classes_, proba)}
            conf = float(max(proba))
            return jsonify({
                'riskLevel': pred,
                'confidence': round(conf, 4),
                'probabilities': prob_dict
            })
        return jsonify(fallback_predict(data))
    except Exception as e:
        return jsonify({'error': str(e), 'fallback': fallback_predict(data.get('painLevel', 5) if isinstance(data, dict) else True)}), 200

def fallback_predict(data):
    pain = data.get('painLevel', 0)
    temp = data.get('temperature', 37)
    red = data.get('redness', 0)
    sw = data.get('swelling', 0)
    discharge = data.get('discharge', 'none')
    score = 0
    if pain >= 7: score += 2
    elif pain >= 4: score += 1
    if temp >= 38.5: score += 2
    elif temp >= 37.5: score += 1
    if red >= 3: score += 2
    if sw >= 3: score += 2
    if discharge == 'severe': score += 3
    elif discharge == 'moderate': score += 2
    elif discharge == 'mild': score += 1
    if data.get('smoking'): score += 1
    if data.get('diabetes'): score += 1
    if data.get('activityLevel') == 'bedridden': score += 1

    if score >= 8: risk = 'high'
    elif score >= 4: risk = 'moderate'
    else: risk = 'normal'

    conf = min(0.95, 0.3 + score * 0.07)
    return {'riskLevel': risk, 'confidence': round(conf, 4),
            'probabilities': {'high': round(max(0.05, (score - 4) * 0.1), 4) if risk != 'normal' else 0.05,
                              'moderate': round(max(0.1, abs(score - 4) * 0.12), 4) if risk != 'high' else 0.1,
                              'normal': round(max(0.1, 1 - (score * 0.1)), 4) if risk == 'normal' else 0.05}}

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)