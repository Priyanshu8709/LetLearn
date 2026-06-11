const router = require('express').Router();
const courseController = require('../controller/Course');
const { auth, isInstructor, isStudent } = require('../middlewares/auth');

router.post('/', auth, isInstructor, courseController.createCourse);
router.get('/', courseController.getAllCourse);
router.get('/search', courseController.searchCourses);
router.get('/top-rated', courseController.getTopRatedCourses);
router.get('/tag/:tagId', courseController.getCoursesByTag);
router.get('/instructor', auth, isInstructor, courseController.getInstructorCourses);
router.get('/student', auth, isStudent, courseController.getStudentCourses);
router.get('/:id', courseController.getCourseDetails);
router.put('/:id', auth, isInstructor, courseController.updateCourse);
router.delete('/:id', auth, isInstructor, courseController.deleteCourse);
router.post('/:id/enroll', auth, isStudent, courseController.enrollCourse);
router.patch('/:id/toggle', auth, isInstructor, courseController.enableDisableCourse);

module.exports = router;
