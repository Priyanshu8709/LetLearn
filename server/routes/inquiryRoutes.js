const router = require('express').Router();
const inquiryController = require('../controller/Inquiry');
const { auth, isInstructor, isStudent } = require('../middlewares/auth');

router.post('/', auth, isStudent, inquiryController.createInquiry);
router.get('/course/:courseId', auth, isInstructor, inquiryController.getInquiries);
router.get('/all', auth, isInstructor, inquiryController.getAllInquiries);
router.delete('/:inquiryId', auth, isInstructor, inquiryController.deleteInquiry);

module.exports = router;
