import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import os

np.random.seed(42)

# ─── Step 1: Load real UCI Post-Operative Patient dataset ───────────────────
uci_data = """L-CORE,L-SURF,L-O2,L-BP,SURF-STBL,CORE-STBL,BP-STBL,COMFORT,decision
mid,low,excellent,mid,stable,stable,stable,15,A
mid,high,excellent,high,stable,stable,stable,10,S
high,low,excellent,high,stable,stable,mod-stable,10,A
mid,low,good,high,stable,stable,mod-stable,15,A
mid,mid,excellent,high,stable,stable,stable,10,A
high,low,good,mid,stable,stable,unstable,15,S
mid,low,excellent,high,stable,stable,mod-stable,5,S
high,mid,excellent,mid,unstable,unstable,stable,10,S
mid,high,good,mid,stable,stable,stable,10,S
mid,low,excellent,mid,unstable,stable,mod-stable,10,S
mid,mid,good,mid,stable,stable,stable,15,A
mid,low,good,high,stable,stable,mod-stable,10,A
high,high,excellent,high,unstable,stable,unstable,15,A
mid,high,good,mid,unstable,stable,mod-stable,10,A
mid,low,good,high,unstable,unstable,stable,15,S
high,high,excellent,high,unstable,stable,unstable,10,A
low,high,good,high,unstable,stable,mod-stable,15,A
mid,low,good,high,unstable,stable,stable,10,A
mid,high,good,mid,unstable,stable,unstable,15,A
mid,mid,good,mid,stable,stable,stable,10,A
low,high,good,mid,unstable,stable,stable,15,A
low,mid,excellent,high,unstable,stable,unstable,10,S
mid,mid,good,mid,unstable,stable,unstable,15,A
mid,mid,good,mid,unstable,stable,stable,10,A
high,high,good,mid,stable,stable,mod-stable,10,A
low,mid,good,mid,unstable,stable,stable,10,A
high,mid,good,low,stable,stable,mod-stable,10,A
low,mid,excellent,high,stable,stable,mod-stable,10,A
mid,mid,excellent,mid,stable,stable,unstable,15,A
mid,mid,good,mid,unstable,stable,unstable,10,S
mid,mid,good,high,unstable,stable,stable,10,A
low,low,good,mid,unstable,stable,unstable,10,A
mid,mid,excellent,high,unstable,stable,mod-stable,10,A
mid,low,good,mid,stable,stable,stable,10,A
low,mid,excellent,high,stable,stable,mod-stable,10,A
mid,mid,good,mid,stable,stable,stable,10,A
low,mid,excellent,mid,stable,stable,stable,10,S
low,low,good,mid,unstable,stable,unstable,10,S
low,low,good,mid,stable,stable,stable,7,S
mid,mid,good,high,unstable,stable,mod-stable,10,A
low,low,good,mid,unstable,stable,stable,10,A
low,mid,good,mid,stable,stable,stable,15,S
high,high,good,high,unstable,stable,stable,15,S
mid,mid,good,mid,stable,stable,stable,10,S
low,low,excellent,mid,stable,stable,stable,10,A
low,mid,good,mid,unstable,stable,stable,10,S
low,mid,good,high,unstable,stable,stable,?,I
mid,mid,excellent,mid,unstable,stable,stable,10,A
high,high,excellent,high,stable,stable,unstable,?,A
mid,high,good,low,unstable,stable,stable,10,A
mid,high,good,mid,unstable,mod-stable,mod-stable,10,A
low,high,excellent,mid,unstable,stable,stable,10,A
mid,low,excellent,high,unstable,stable,unstable,10,A
mid,mid,good,mid,unstable,stable,mod-stable,10,S
high,high,excellent,mid,unstable,stable,mod-stable,10,A
mid,mid,good,mid,unstable,stable,stable,15,A
high,mid,good,high,stable,stable,unstable,15,A
mid,low,good,high,unstable,stable,mod-stable,10,A
low,low,good,high,stable,stable,stable,10,A
mid,high,good,mid,stable,stable,mod-stable,10,A
mid,high,good,mid,unstable,stable,unstable,10,A
mid,low,excellent,high,stable,stable,stable,10,A
mid,mid,good,mid,stable,stable,unstable,10,A
mid,low,excellent,mid,stable,stable,unstable,10,S
high,mid,excellent,mid,unstable,unstable,unstable,10,A
mid,mid,good,high,stable,stable,stable,10,S
mid,low,excellent,mid,unstable,stable,stable,10,A
mid,mid,excellent,mid,unstable,stable,stable,10,A
mid,mid,excellent,high,stable,stable,stable,10,A
mid,mid,excellent,low,stable,stable,stable,10,A
mid,low,excellent,mid,unstable,unstable,unstable,?,A
low,low,excellent,mid,stable,stable,stable,10,A
mid,mid,excellent,mid,stable,stable,mod-stable,10,S
mid,mid,excellent,high,stable,stable,stable,10,A
mid,low,excellent,high,stable,stable,mod-stable,10,A
low,mid,good,mid,stable,stable,unstable,10,A
mid,mid,excellent,mid,stable,stable,mod-stable,10,A
mid,mid,excellent,mid,stable,stable,unstable,10,A
mid,mid,excellent,mid,unstable,unstable,stable,10,S
mid,mid,good,high,stable,stable,stable,10,A
mid,mid,excellent,mid,stable,stable,stable,15,A
mid,mid,excellent,mid,stable,stable,stable,10,S
mid,low,good,mid,stable,stable,unstable,10,I
high,mid,excellent,mid,unstable,stable,unstable,5,A
mid,mid,excellent,mid,stable,stable,unstable,10,A
mid,mid,excellent,mid,unstable,stable,stable,10,A
mid,mid,excellent,mid,unstable,stable,stable,15,S
mid,mid,good,mid,unstable,stable,stable,15,A
mid,mid,excellent,mid,unstable,stable,stable,10,A
mid,mid,good,mid,unstable,stable,stable,15,S"""

from io import StringIO
uci_df = pd.read_csv(StringIO(uci_data))
uci_df = uci_df[uci_df['decision'] != '?']
print(f"UCI base dataset loaded: {len(uci_df)} rows")

# ─── Step 2: Label mapping ───────────────────────────────────────────────────
# A → normal (safe), S → moderate (risk), I → high (urgent)
label_map = {'A': 'normal', 'S': 'moderate', 'I': 'high'}
uci_df['risk'] = uci_df['decision'].map(label_map)

# ─── Step 3: Synthetic augmentation ─────────────────────────────────────────
# We'll generate 5000+ rows by sampling from the learned distributions
# and adding correlated synthetic features: smoking, diabetes, redness, swelling, discharge

TARGET_ROWS = 5500
aug_rows = []

cat_cols = ['L-CORE','L-SURF','L-O2','L-BP','SURF-STBL','CORE-STBL','BP-STBL']
cat_vals = {c: list(uci_df[c].unique()) for c in cat_cols}
comfort_min, comfort_max = uci_df['COMFORT'].min(), uci_df['COMFORT'].max()
decision_weights = uci_df['risk'].value_counts(normalize=True).to_dict()

for _ in range(TARGET_ROWS):
    row = {c: np.random.choice(cat_vals[c]) for c in cat_cols}
    row['COMFORT'] = np.random.randint(comfort_min, comfort_max + 1)

    # Derive synthetic features from the real ones with some noise
    core_map = {'low': 36.5, 'mid': 37.2, 'high': 38.1}
    surf_map = {'low': 35.8, 'mid': 36.4, 'high': 37.0}
    bp_map = {'low': 90, 'mid': 115, 'high': 140}

    row['core_temp'] = core_map[row['L-CORE']] + np.random.normal(0, 0.2)
    row['surface_temp'] = surf_map[row['L-SURF']] + np.random.normal(0, 0.15)
    row['bp_systolic'] = bp_map[row['L-BP']] + np.random.normal(0, 8)
    row['oxygen_sat'] = 98 - (row['COMFORT'] - 5) * 0.3 + np.random.normal(0, 1.5)
    row['comfort'] = row['COMFORT']

    # Add smoking (correlated with risk indicators)
    risk_score = (1 if row['L-CORE'] == 'high' else 0) + (1 if row['CORE-STBL'] == 'unstable' else 0) + (1 if row['BP-STBL'] == 'unstable' else 0)
    row['smoking'] = 1 if (np.random.random() < 0.15 + risk_score * 0.1) else 0
    row['diabetes'] = 1 if np.random.random() < 0.12 else 0
    row['redness'] = min(4, max(0, int(risk_score + np.random.choice([-1, 0, 0, 1]))))
    row['swelling'] = min(4, max(0, int(risk_score - 1 + np.random.choice([-1, 0, 1]))))
    row['discharge_score'] = min(3, max(0, int(risk_score - 1 + np.random.choice([0, 1, 2]))))

    row['risk'] = np.random.choice(list(decision_weights.keys()), p=list(decision_weights.values()))
    aug_rows.append(row)

aug_df = pd.DataFrame(aug_rows)
print(f"Augmented dataset: {len(aug_df)} rows")

# ─── Step 4: Build feature matrix ─────────────────────────────────────────────
features = ['core_temp', 'surface_temp', 'bp_systolic', 'oxygen_sat', 'comfort',
            'smoking', 'diabetes', 'redness', 'swelling', 'discharge_score',
            'L-CORE', 'L-SURF', 'L-O2', 'L-BP', 'SURF-STBL', 'CORE-STBL', 'BP-STBL']

le = {c: LabelEncoder() for c in cat_cols}
for c in cat_cols:
    aug_df[c] = le[c].fit_transform(aug_df[c])

X = aug_df[features]
y = aug_df['risk']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# ─── Step 5: Train RandomForest ───────────────────────────────────────────────
clf = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print(f"\nAccuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['high', 'moderate', 'normal']))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred, labels=['high', 'moderate', 'normal']))

# Feature importance
importances = pd.Series(clf.feature_importances_, index=features).sort_values(ascending=False)
print("\nTop Feature Importances:")
print(importances.head(10))

# ─── Step 6: Save ─────────────────────────────────────────────────────────────
os.makedirs('model', exist_ok=True)
joblib.dump(clf, 'model/rf_model.pkl')
joblib.dump(le, 'model/label_encoders.pkl')
print("\nModel and encoders saved to model/")
print(f"Training complete: {len(X_train)} train / {len(X_test)} test samples")