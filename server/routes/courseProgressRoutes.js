const router = require('express').Router();
const courseProgressController = require('../controller/CourseProgress');
const { auth, isStudent } = require('../middlewares/auth');

router.post('/update', auth, isStudent, courseProgressController.updateProgress);
router.get('/:courseId', auth, isStudent, courseProgressController.getProgress);
router.get('/', auth, isStudent, courseProgressController.getAllUserProgress);
router.delete('/:courseId', auth, isStudent, courseProgressController.resetProgress);

module.exports = router;
