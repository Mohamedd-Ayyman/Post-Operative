const mongoose = require('mongoose');

const recoverySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  painLevel: { type: Number, required: true, min: 0, max: 10 },
  temperature: { type: Number, required: true },
  redness: { type: Number, required: true, min: 0, max: 4 },
  swelling: { type: Number, required: true, min: 0, max: 4 },
  discharge: { type: String, enum: ['none', 'mild', 'moderate', 'severe'], required: true },
  daysSinceSurgery: { type: Number, required: true, min: 0 },
  activityLevel: { type: String, enum: ['bedridden', 'low', 'moderate', 'normal'], required: true },
  smoking: { type: Boolean, default: false },
  diabetes: { type: Boolean, default: false },
  notes: { type: String },
  imageUrl: { type: String },
  prediction: {
    riskLevel: { type: String, enum: ['normal', 'moderate', 'high'], required: true },
    confidence: { type: Number },
    probabilities: {
      normal: { type: Number },
      moderate: { type: Number },
      high: { type: Number },
    },
    advice: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

recoverySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('RecoveryRecord', recoverySchema);