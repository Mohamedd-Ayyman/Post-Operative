# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PostOp Guard System                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Client     │  │   Server     │  │   ML Service         │  │
│  │  React+Vite  │──│  Express.js  │──│   Flask+Sklearn      │  │
│  │  Redux       │◀─│  MongoDB     │  │   RandomForest       │  │
│  │  Recharts    │  │  Socket.IO   │  └──────────────────────┘  │
│  │  Tailwind    │  │  BullMQ      │            ▲                │
│  └──────────────┘  └──────┬───────┘            │                │
│         │                 │           predict   │                │
│   Socket.IO◀──────────────┤◀─────────────────────┘                │
│                           │                                       │
│                    ┌──────▼──────┐                                │
│                    │  MongoDB   │                                │
│                    │  (Atlas)    │                                │
│                    └─────────────┘                                │
│                           ▲                                       │
│                    ┌──────┴──────┐                                │
│                    │   Redis     │                                │
│                    │ (Upstash)   │                                │
│                    └─────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. Patient submits check-in form → React → Redux action
2. Redux dispatches async thunk → Axios → POST /api/prediction
3. Express validates with Zod → saves RecoveryRecord to MongoDB
4. Server calls ML service /predict endpoint
5. ML service returns riskLevel, confidence, probabilities
6. Server emits Socket.IO event if high risk
7. Client displays results + charts

## Service Boundaries

| Service | Responsibility |
|---------|---------------|
| client/ | UI, state management, charts, auth flow |
| server/ | API, auth, persistence, realtime, validation |
| ml-service/ | ML inference, model loading, prediction |
| nginx/ | Reverse proxy (in docker-compose) |