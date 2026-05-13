const express = require('express');
const router = express.Router();
const predictionCtrl = require('../controllers/predictionController');
const { auth } = require('../middlewares/auth');

router.post('/', auth(), predictionCtrl.submitCheckIn);
router.get('/history', auth(), predictionCtrl.getHistory);
router.get('/trends', auth(), predictionCtrl.getTrends);
router.get('/:id', auth(), predictionCtrl.getRecord);

module.exports = router;