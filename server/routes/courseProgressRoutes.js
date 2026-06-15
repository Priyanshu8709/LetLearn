const router = require('express').Router();
const ctrl = require('../controller/CourseProgress');
const { auth, isStudent } = require('../middlewares/auth');

// Specific routes BEFORE param routes to avoid Express matching them as :courseId
router.get('/',                auth, isStudent, ctrl.getAllUserProgress);  // GET  /progress
router.post('/update',         auth, isStudent, ctrl.updateProgress);      // POST /progress/update
router.get('/:courseId',       auth, isStudent, ctrl.getProgress);         // GET  /progress/:courseId
router.delete('/:courseId',    auth, isStudent, ctrl.resetProgress);       // DELETE /progress/:courseId

module.exports = router;
