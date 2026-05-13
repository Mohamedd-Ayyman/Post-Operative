const express = require('express');
const router = express.Router();
const analyticsCtrl = require('../controllers/analyticsController');
const { auth } = require('../middlewares/auth');

router.get('/dashboard', auth(), analyticsCtrl.getDashboard);
router.get('/admin', auth(['admin', 'doctor']), analyticsCtrl.getAdminStats);
router.patch('/notifications/:id/read', auth(), analyticsCtrl.markRead);

module.exports = router;