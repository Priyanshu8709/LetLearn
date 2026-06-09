const router = require('express').Router();
const profileController = require('../controller/Profile');
const { auth } = require('../middlewares/auth');

router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.delete('/', auth, profileController.deleteUser);

module.exports = router;
