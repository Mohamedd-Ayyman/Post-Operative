# Post-Surgical Infection Risk Prediction System

A production-grade healthcare web platform that monitors post-surgical patient recovery and detects post-operative wound infections early using AI-powered risk prediction.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│  ML Service │
│  (React)    │◀────│ (Express)  │     │  (Flask)    │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     │ Socket.IO          │ MongoDB            │ RandomForest
     │                    │                    │
     └────────────────────┴────────────────────┘
```

## Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, Tailwind CSS, Recharts, Socket.IO
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, Zod
- **ML**: Python, Scikit-learn, RandomForest, Flask
- **Infrastructure**: Docker, Docker Compose

## Dataset

The ML model is trained using a hybrid approach:
1. **Base**: UCI Post-Operative Patient dataset (87 real patient records)
2. **Augmentation**: Medically-correlated synthetic data expansion to 5,500 rows
3. **Enhancement**: Additional features (smoking, diabetes, redness, swelling, discharge)

Label mapping:
- `A` (original) → `normal` — No complications, safe for discharge
- `S` (original) → `moderate` — Some risk factors, monitoring needed
- `I` (original) → `high` — Immediate attention required

## Setup

### Development

```bash
# Backend
cd server && npm install && npm run dev

# ML Service
cd ml-service && pip install -r requirements.txt && python train_model.py && python app.py

# Frontend
cd client && npm install && npm run dev
```

### Docker

```bash
docker-compose up --build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `REDIS_URL` | Redis/Upstash URL |
| `ML_SERVICE_URL` | ML service URL |
| `CLOUDINARY_*` | Cloudinary credentials |

## Features

- JWT authentication with RBAC (patient/doctor/admin)
- Multi-step daily recovery check-in form
- Real-time AI risk prediction (normal/moderate/high)
- Recovery trend charts (Recharts)
- Socket.IO real-time alerts
- Admin dashboard with high-risk monitoring
- Full REST API with Swagger docs

## Pages

- `/` — Landing page
- `/login` — Patient login
- `/register` — Patient registration
- `/dashboard` — Recovery overview + charts
- `/check-in` — Multi-step recovery form
- `/check-in/result` — Prediction results
- `/history` — Paginated history
- `/admin` — Doctor/Admin dashboard

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/prediction` | Submit check-in |
| GET | `/api/prediction/history` | Recovery history |
| GET | `/api/prediction/trends` | Trend data |
| GET | `/api/analytics/dashboard` | User dashboard |
| GET | `/api/analytics/admin` | Admin stats |

## Ports

- Frontend: `3000`
- Backend: `3001`
- ML Service: `5000`