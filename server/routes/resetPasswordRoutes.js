const router = require('express').Router();
const { resetPassword, updatePassword } = require('../controller/ResetPassword');

router.post('/', resetPassword);
router.post('/update', updatePassword);

module.exports = router;
