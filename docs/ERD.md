# Entity-Relationship Diagram

## User
```
users
├── _id: ObjectId (PK)
├── name: String (required)
├── email: String (unique, required)
├── password: String (hashed, required)
├── role: Enum ['patient', 'doctor', 'admin'] (default: patient)
├── phone: String
├── dateOfBirth: Date
├── surgeryDate: Date
├── surgeryType: String
├── doctor: ObjectId (ref: User)
├── lastCheckIn: Date
└── createdAt: Date
```

## RecoveryRecord
```
recovery_records
├── _id: ObjectId (PK)
├── user: ObjectId (ref: User, required)
├── painLevel: Number (0-10)
├── temperature: Number (°C)
├── redness: Number (0-4)
├── swelling: Number (0-4)
├── discharge: Enum ['none', 'mild', 'moderate', 'severe']
├── daysSinceSurgery: Number
├── activityLevel: Enum ['bedridden', 'low', 'moderate', 'normal']
├── smoking: Boolean
├── diabetes: Boolean
├── notes: String
├── imageUrl: String
├── prediction: {
│   ├── riskLevel: Enum ['normal', 'moderate', 'high']
│   ├── confidence: Number
│   ├── probabilities: {
│   │   ├── normal: Number
│   │   ├── moderate: Number
│   │   └── high: Number
│   }
│   └── advice: String
│ }
├── createdAt: Date
└── [index: user + createdAt]
```

## Notification
```
notifications
├── _id: ObjectId (PK)
├── user: ObjectId (ref: User, required)
├── type: Enum ['high_risk', 'worsening_trend', 'reminder', 'info']
├── title: String (required)
├── message: String (required)
├── read: Boolean (default: false)
├── data: Mixed
└── createdAt: Date
```

## Relationships
- User (1) → (N) RecoveryRecord: one user has many check-in records
- User (1) → (N) Notification: one user has many notifications
- User (1) → (N) User: one doctor can be assigned to many patients
- RecoveryRecord (N) → (1) User: each record belongs to one patient