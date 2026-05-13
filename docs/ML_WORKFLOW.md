# ML Workflow

## Dataset

- **Base**: UCI Post-Operative Patient dataset (87 records)
  - Source: UCI Machine Learning Repository
  - Features: L-CORE, L-SURF, L-O2, L-BP, SURF-STBL, CORE-STBL, BP-STBL, COMFORT
  - Original decision labels: A (Adm-intent to discharge), S (Stable to go home), I (Send to ICU)

## Label Mapping

| Original UCI Label | Mapped Label | Meaning |
|--------------------|--------------|---------|
| A | `normal` | Safe recovery, no complications |
| S | `moderate` | Some risk factors, monitoring needed |
| I | `high` | Immediate medical attention required |

## Feature Engineering

17 total features, 17 dimensions:

| Feature | Type | Source |
|---------|------|--------|
| core_temp | continuous | Derived from L-CORE |
| surface_temp | continuous | Derived from L-SURF |
| bp_systolic | continuous | Derived from L-BP |
| oxygen_sat | continuous | Derived from L-O2 |
| comfort | discrete | COMFORT column |
| smoking | binary | Synthetic |
| diabetes | binary | Synthetic |
| redness | discrete (0-4) | Synthetic |
| swelling | discrete (0-4) | Synthetic |
| discharge_score | discrete (0-3) | Synthetic |
| L-CORE (encoded) | categorical | Original |
| L-SURF (encoded) | categorical | Original |
| L-O2 (encoded) | categorical | Original |
| L-BP (encoded) | categorical | Original |
| SURF-STBL (encoded) | categorical | Original |
| CORE-STBL (encoded) | categorical | Original |
| BP-STBL (encoded) | categorical | Original |

## Model

**RandomForestClassifier** with:
- n_estimators: 200
- max_depth: 15
- min_samples_split: 5
- min_samples_leaf: 2
- class_weight: balanced
- Stratified train/test split (80/20)

## Performance

| Metric | High | Moderate | Normal | Weighted Avg |
|--------|------|----------|--------|--------------|
| Precision | 0.77 | 0.71 | 0.87 | 0.79 |
| Recall | 0.69 | 0.78 | 0.82 | 0.78 |
| F1-Score | 0.73 | 0.75 | 0.84 | 0.78 |
| **Accuracy** | | | | **0.78** |

## Prediction Endpoint

`POST /predict`
- Input: JSON with 9 app-level features
- Inferred: 8 derived categorical features (from app features)
- Output: { riskLevel, confidence, probabilities }

The app.py service maps app inputs to UCI feature space:
- painLevel → COMFORT (inverse relationship)
- temperature → L-CORE (low/mid/high ranges)
- redness/swelling → SURF-STBL stability
- painLevel/temperature → CORE-STBL
- discharge/activity → BP-STBL
- smoking/diabetes → additional risk score

When model is unavailable, fallback rule-based scoring is used.