const router = require('express').Router();
const paymentController = require('../controller/Payment');
const { auth, isStudent } = require('../middlewares/auth');

router.post('/capture', auth, isStudent, paymentController.capturePayment);
router.post('/verify', auth, isStudent, paymentController.verifyPayment);
router.get('/all', auth, paymentController.getAllPayments);

module.exports = router;
