const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', auth(), authCtrl.me);
router.put('/profile', auth(), authCtrl.updateProfile);

module.exports = router;