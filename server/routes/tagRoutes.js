const router = require('express').Router();
const tagController = require('../controller/Tags');
const { auth, isInstructor } = require('../middlewares/auth');

router.post('/', auth, isInstructor, tagController.createTag);
router.get('/', tagController.getAllTags);

module.exports = router;
