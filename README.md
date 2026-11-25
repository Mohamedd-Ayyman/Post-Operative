<div align="center">

# 🩹 PostOp Guard: Post-Surgical Infection Risk Prediction

**A healthcare platform that monitors patients' recovery after surgery and flags likely wound infections early, using machine-learning risk prediction.**

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
<br/>
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📖 Overview

Surgical-site infections are among the most common complications after surgery. **PostOp Guard** lets patients submit a short **daily recovery check-in** (vital signs and wound condition). A **Random Forest model** classifies each check-in as **normal, moderate or high risk**, and clinicians get **real-time alerts** when a patient needs attention.

## ✨ Features

- 🔐 **JWT authentication with RBAC**: patient, doctor and admin roles
- 📝 **Multi-step daily check-in** covering temperature, blood pressure, oxygen saturation, comfort, redness, swelling and discharge
- 🤖 **Real-time AI risk prediction** (normal / moderate / high) from a Python ML microservice
- 📈 **Recovery trend charts** built with Recharts
- 🔔 **Live alerts** over Socket.IO, plus Redis-backed reminder queues
- 🧑‍⚕️ **Admin dashboard** for monitoring high-risk patients
- 🗂️ Check-in **history** and results pages
- 📚 Full REST API documented with **Swagger / OpenAPI**
- ✅ Tests with Jest, Supertest and Vitest

## 🏗️ Architecture

```
┌──────────────┐  REST / WS   ┌──────────────┐    HTTP    ┌──────────────┐
│   Client     │ ───────────▶ │   Server     │ ─────────▶ │  ML Service  │
│ React + Vite │ ◀─────────── │ Express API  │ ◀───────── │ Flask + RF   │
└──────────────┘  Socket.IO   └──────┬───────┘            └──────────────┘
                                     │
                           MongoDB · Redis (queues)
```

Further documentation is in [`docs/`](docs/): [Architecture](docs/ARCHITECTURE.md), [API flow](docs/API_FLOW.md), [ERD](docs/ERD.md), [ML workflow](docs/ML_WORKFLOW.md) and the [OpenAPI spec](docs/openapi.yaml).

## 🧠 ML Model

| | |
|---|---|
| **Dataset** | UCI Post-Operative Patient dataset (87 records), augmented to 5,500 rows |
| **Features** | 17 (core and surface temperature, BP, O₂ saturation, comfort, wound redness, swelling, discharge, comorbidities, stability indicators…) |
| **Model** | `RandomForestClassifier` (200 trees, max depth 15) |
| **Accuracy** | ~78% weighted average |
| **Labels** | A → `normal` · S → `moderate` · I → `high` |

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Redux Toolkit, Tailwind CSS, Recharts, Socket.IO client, Vitest |
| **Backend** | Node.js, Express, Mongoose, JWT, Zod, Helmet, Winston, Socket.IO, Redis, Swagger UI |
| **ML** | Python, Flask, scikit-learn, pandas, NumPy |
| **Infrastructure** | Docker, Docker Compose, Nginx; deploys to Vercel (client) and Railway (API and ML) |

## 🚀 Getting Started

### Docker
```bash
git clone https://github.com/Mohamedd-Ayyman/Post-Operative.git
cd Post-Operative
docker compose up --build
```

### Manual
```bash
# 1. ML service
cd ml-service
pip install -r requirements.txt
python train_model.py      # first run only
python app.py              # :5000

# 2. API
cd ../server
npm install
node server.js             # :3001

# 3. Client
cd ../client
npm install
npm run dev                # :5173
```

## 🔐 Environment Variables (`server/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `REDIS_URL` | Redis connection URL |
| `ML_SERVICE_URL` | URL of the ML microservice |
| `CLOUDINARY_*` | Image upload credentials |
| `CORS_ORIGINS` | Allowed frontend origins |

> Keep real values out of version control. Commit only a `.env.example`.

## ☁️ Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel (root: `client/`, framework: Vite) |
| Backend API | Railway (root: `server/`) |
| ML service | Railway (root: `ml-service/`) |
| Database / cache | MongoDB Atlas · Upstash Redis |

## ⚕️ Disclaimer

This is an academic project. It is **not** a certified medical device and must not replace professional clinical judgement.

## 👤 Author

**Mohamed Ayman**, Frontend / Full-Stack Developer · [GitHub](https://github.com/Mohamedd-Ayyman) · [LinkedIn](https://linkedin.com/in/mohamed-ayman-8787b0269)
