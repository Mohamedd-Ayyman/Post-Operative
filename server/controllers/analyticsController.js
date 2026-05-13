const Notification = require('../models/Notification');
const RecoveryRecord = require('../models/RecoveryRecord');
const User = require('../models/User');

const analyticsCtrl = {
  getDashboard: async (req, res) => {
    const userId = req.user.id;
    const [totalRecords, lastRecord, recentRecords, notifications] = await Promise.all([
      RecoveryRecord.countDocuments({ user: userId }),
      RecoveryRecord.findOne({ user: userId }).sort({ createdAt: -1 }),
      RecoveryRecord.find({ user: userId }).sort({ createdAt: -1 }).limit(7),
      Notification.find({ user: userId, read: false }).sort({ createdAt: -1 }).limit(10),
    ]);
    res.json({ totalRecords, lastRecord, recentRecords, notifications, unreadCount: notifications.length });
  },

  getAdminStats: async (req, res) => {
    const [totalUsers, totalRecords, highRiskCount, moderateCount] = await Promise.all([
      User.countDocuments(),
      RecoveryRecord.countDocuments(),
      RecoveryRecord.countDocuments({ 'prediction.riskLevel': 'high' }),
      RecoveryRecord.countDocuments({ 'prediction.riskLevel': 'moderate' }),
    ]);
    const recentHighRisk = await RecoveryRecord.find({ 'prediction.riskLevel': 'high' })
      .sort({ createdAt: -1 }).limit(10).populate('user', 'name email');
    res.json({ totalUsers, totalRecords, highRiskCount, moderateCount, recentHighRisk });
  },

  markRead: async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  },
};

module.exports = analyticsCtrl;