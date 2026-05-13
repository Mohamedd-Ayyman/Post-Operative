# API Flow

## Authentication Flow

```
[Login Form]
    │
    ▼ POST /api/auth/login
[Express] → validate Zod → User.findOne() → bcrypt.compare()
    │
    ▼ JWT.sign({ id, role }, secret, { expiresIn: '7d' })
[Token returned to client]
    │
    ▼ localStorage.setItem('token')
[Redux store updated with user + token]
    │
    ▼ axios interceptor attaches Bearer token to all requests
```

## Prediction Flow

```
[Check-In Form (multi-step)]
    │
    ▼ Step 4: Submit button
[Redux: submitCheckIn] → POST /api/prediction
    │
    ▼ Zod validation in controller
[Server] → POST http://ml-service:5000/predict
    │
    ▼ RandomForest.predict() with 17 features
[ML Service returns { riskLevel, confidence, probabilities }]
    │
    ▼ Server saves RecoveryRecord + creates Notification (if high)
[Server emits: io.to(`user:${id}`).emit('high_risk', {...})]
    │
    ▼ Client navigates to /check-in/result
[Results page reads currentRecord from Redux]
```

## Data Models

### User
```
_id: ObjectId
name: string
email: string (unique)
password: string (hashed)
role: 'patient' | 'doctor' | 'admin'
phone?: string
dateOfBirth?: Date
surgeryDate?: Date
surgeryType?: string
lastCheckIn?: Date
createdAt: Date
```

### RecoveryRecord
```
_id: ObjectId
user: ObjectId (ref: User)
painLevel: number (0-10)
temperature: number
redness: number (0-4)
swelling: number (0-4)
discharge: 'none' | 'mild' | 'moderate' | 'severe'
daysSinceSurgery: number
activityLevel: 'bedridden' | 'low' | 'moderate' | 'normal'
smoking: boolean
diabetes: boolean
notes?: string
imageUrl?: string
prediction: {
  riskLevel: 'normal' | 'moderate' | 'high'
  confidence: number
  probabilities: { normal, moderate, high }
  advice: string
}
createdAt: Date
```

### Notification
```
_id: ObjectId
user: ObjectId (ref: User)
type: 'high_risk' | 'worsening_trend' | 'reminder' | 'info'
title: string
message: string
read: boolean (default: false)
data: Mixed
createdAt: Date
```