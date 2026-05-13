const RecoveryRecord = require('../models/RecoveryRecord');
const { z } = require('zod');

const predictionSchema = z.object({
  painLevel: z.number().min(0).max(10),
  temperature: z.number(),
  redness: z.number().min(0).max(4),
  swelling: z.number().min(0).max(4),
  discharge: z.enum(['none', 'mild', 'moderate', 'severe']),
  daysSinceSurgery: z.number().min(0),
  activityLevel: z.enum(['bedridden', 'low', 'moderate', 'normal']),
  smoking: z.boolean(),
  diabetes: z.boolean(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

const predictionMap = {
  normal: { advice: 'Your recovery is progressing well. Continue monitoring daily and maintain good hygiene.', color: 'green' },
  moderate: { advice: 'Some symptoms warrant attention. Consider rest, wound care, and contact your doctor if symptoms worsen within 48 hours.', color: 'yellow' },
  high: { advice: 'High infection risk detected. Please contact your healthcare provider immediately or visit an emergency department.', color: 'red' },
};

const predictionCtrl = {
  submitCheckIn: async (req, res) => {
    try {
      const data = predictionSchema.parse(req.body);
      const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';

      let mlResult;
      try {
        const mlRes = await fetch(`${mlUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (mlRes.ok) {
          mlResult = await mlRes.json();
        } else {
          mlResult = fallbackPredict(data);
        }
      } catch {
        mlResult = fallbackPredict(data);
      }

      const { riskLevel, confidence, probabilities } = mlResult;
      const advice = predictionMap[riskLevel]?.advice || predictionMap.normal.advice;

      const record = await RecoveryRecord.create({
        user: req.user.id,
        ...data,
        prediction: { riskLevel, confidence, probabilities, advice },
      });

      if (riskLevel === 'high') {
        const Notification = require('../models/Notification');
        await Notification.create({
          user: req.user.id, type: 'high_risk', title: 'High Infection Risk Detected',
          message: `Your latest check-in shows high infection risk. ${advice}`,
          data: { recordId: record._id },
        });
        const io = req.app.get('io');
        if (io) io.to(`user:${req.user.id}`).emit('high_risk', { recordId: record._id, riskLevel, advice });
      }

      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: 'Check-in failed' });
    }
  },

  getHistory: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const records = await RecoveryRecord.find({ user: req.user.id })
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const total = await RecoveryRecord.countDocuments({ user: req.user.id });
    res.json({ records, total, page, pages: Math.ceil(total / limit) });
  },

  getRecord: async (req, res) => {
    const record = await RecoveryRecord.findOne({ _id: req.params.id, user: req.user.id })
      .populate('user', 'name email');
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  },

  getTrends: async (req, res) => {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const records = await RecoveryRecord.find({ user: req.user.id, createdAt: { $gte: since } })
      .sort({ createdAt: 1 }).select('painLevel temperature redness swelling daysSinceSurgery prediction.createdAt');
    res.json(records);
  },
};

function fallbackPredict(data) {
  let score = 0;
  if (data.painLevel >= 7) score += 2; else if (data.painLevel >= 4) score += 1;
  if (data.temperature >= 38.5) score += 2; else if (data.temperature >= 37.5) score += 1;
  if (data.redness >= 3) score += 2; else if (data.redness >= 1) score += 1;
  if (data.swelling >= 3) score += 2; else if (data.swelling >= 1) score += 1;
  if (data.discharge === 'severe') score += 3; else if (data.discharge === 'moderate') score += 2; else if (data.discharge === 'mild') score += 1;
  if (data.smoking) score += 1;
  if (data.diabetes) score += 1;
  if (data.activityLevel === 'bedridden') score += 1;

  let riskLevel, confidence;
  if (score >= 7) { riskLevel = 'high'; confidence = Math.min(0.9, 0.5 + score * 0.05); }
  else if (score >= 4) { riskLevel = 'moderate'; confidence = Math.min(0.75, 0.4 + score * 0.05); }
  else { riskLevel = 'normal'; confidence = Math.min(0.9, 0.7 - score * 0.05); }

  return { riskLevel, confidence, probabilities: { normal: riskLevel === 'normal' ? confidence : 1 - confidence, moderate: riskLevel === 'moderate' ? confidence : 0.1, high: riskLevel === 'high' ? confidence : 0.05 } };
}

module.exports = predictionCtrl;