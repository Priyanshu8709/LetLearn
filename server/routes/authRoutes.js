const router = require('express').Router();
const { sendOtp, signUp, login, changePassword } = require('../controller/Auth');

router.post('/send-otp', sendOtp);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/change-password', changePassword);

module.exports = router;
