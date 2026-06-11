const router = require('express').Router();
const adminController = require('../controller/Admin');
const { auth, isAdmin } = require('../middlewares/auth');

router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.get('/courses', auth, isAdmin, adminController.getAllCourses);
router.patch('/courses/:courseId/approve', auth, isAdmin, adminController.approveCourse);
router.delete('/courses/:courseId/reject', auth, isAdmin, adminController.rejectCourse);
router.get('/inquiries', auth, isAdmin, adminController.getAllInquiries);
router.get('/stats', auth, isAdmin, adminController.getPlatformStats);
router.get('/top-courses', auth, isAdmin, adminController.getTopCourses);
router.patch('/users/:userId/block', auth, isAdmin, adminController.blockUser);
router.patch('/users/:userId/unblock', auth, isAdmin, adminController.unblockUser);

module.exports = router;
