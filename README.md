# Post-Surgical Infection Risk Prediction System

A production-grade healthcare web platform that monitors post-surgical patient recovery and detects post-operative wound infections early using AI-powered risk prediction.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│  ML Service │
│  (Vercel)   │◀────│ (Railway)   │     │  (Railway)  │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     │ Socket.IO          │ MongoDB            │ RandomForest
     │                    │ (Atlas)            │
     └────────────────────┴────────────────────┘
```

## Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, Tailwind CSS, Recharts, Socket.IO
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, Zod, Socket.IO, BullMQ
- **ML**: Python, Scikit-learn, RandomForest, Flask
- **Infrastructure**: Docker, Docker Compose, Railway, Vercel

## Deployment Strategy

### Where to Deploy Each Part

| Service | Platform | Why |
|---------|----------|-----|
| **Frontend** | Vercel | Best for React/Vite, free tier, auto-deploy from Git |
| **Backend API** | Railway | Supports Node.js, env vars, custom domain, free tier |
| **ML Service** | Railway | Supports Python/Flask, custom port, persistent |
| **MongoDB** | Atlas | Already configured (your existing cluster) |
| **Redis** | Upstash | Already configured (your existing instance) |

---

## Step 1: Deploy ML Service (Railway)

1. Create a new Railway project
2. Connect your GitHub repo
3. Set the root directory to `ml-service/`
4. Add start command: `python app.py`
5. Add environment variable:
   ```
   MODEL_PATH=/app/model/rf_model.pkl
   ```
6. Deploy — note the deployed URL (e.g., `https://postop-ml.up.railway.app`)

---

## Step 2: Deploy Backend (Railway)

1. Create a new Railway project
2. Connect your GitHub repo
3. Set the root directory to `server/`
4. Start command: `node server.js`
5. Add environment variables:

```
MONGO_URI=mongodb+srv://Mezax:hfbUs7jK6tW0Pm05@cluster0.n6aw3f3.mongodb.net/postop
JWT_SECRET=MezaxGalalovic
REDIS_URL=rediss://default:gQAAAAAAAVKyAAIgcDEwZjcyYWI0NGYyYWU0N2I5OTQwZmU5YjViY2IzMzJkMA@infinite-cricket-86706.upstash.io:6379
CLOUDINARY_CLOUD_NAME=dvcsoqnjl
CLOUDINARY_API_KEY=682685848131469
CLOUDINARY_API_SECRET=TMVoV5GnKjVW3miLKOENtuN9phk
ML_SERVICE_URL=https://your-ml-service.railway.app
PORT=3001
NODE_ENV=production
```

6. Deploy — note the backend URL (e.g., `https://postop-api.up.railway.app`)

---

## Step 3: Update Frontend for Production

Before deploying to Vercel, update the backend URL:

```js
// client/vite.config.js — add your Railway backend URL
proxy: {
  '/api': {
    target: 'https://postop-api.up.railway.app',  // ← your backend URL
    changeOrigin: true,
  },
}
```

Then rebuild:

```bash
cd client && npm run build
```

---

## Step 4: Deploy Frontend (Vercel)

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select the repo, set root directory to `client/`
4. Framework: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add environment variable:
   ```
   VITE_API_URL=https://postop-api.up.railway.app
   ```
8. Deploy

---

## Alternative: Use Vite Env Variables

Instead of proxy in vite.config, use Vite's env system:

```env
# client/.env.production
VITE_API_URL=https://postop-api.up.railway.app
```

Then in your API lib, use:
```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api' || '/api',
  // ...
});
```

---

## Alternative: Keep Everything Docker-Ready

If you want a simpler approach that still works with your existing stack:

1. Deploy **Backend + ML** together on Railway using Docker:
   - Use `docker-compose.yml` as the Railway config
   - Railway supports Docker deployments
2. Deploy **Frontend** on Vercel (static build)
3. Connect them via environment variables

---

## Running Locally (Without Docker)

```bash
# 1. Start ML Service
cd ml-service
pip install -r requirements.txt
python train_model.py    # train model first time
python app.py            # starts on port 5000

# 2. Start Backend
cd server
npm install
node server.js           # starts on port 3001

# 3. Start Frontend
cd client
npm install
npm run dev              # starts on port 5173
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `REDIS_URL` | Upstash Redis URL |
| `ML_SERVICE_URL` | Deployed ML service URL |
| `CLOUDINARY_*` | Image upload credentials |

## Features

- JWT authentication with RBAC (patient/doctor/admin)
- Multi-step daily recovery check-in form
- Real-time AI risk prediction (normal/moderate/high)
- Recovery trend charts (Recharts)
- Socket.IO real-time alerts
- Admin dashboard with high-risk monitoring
- Full REST API with Swagger docs
- ML trained on UCI Post-Operative Patient dataset

## ML Model

- **Dataset**: UCI Post-Operative Patient dataset (87 real records)
- **Augmentation**: Synthetic expansion to 5,500 rows
- **Model**: RandomForestClassifier (200 trees, depth 15)
- **Accuracy**: 78% weighted average
- **Labels**: A→normal, S→moderate, I→high

## Ports

- Frontend (dev): `5173`
- Backend: `3001`
- ML Service: `5000`