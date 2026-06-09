const router = require('express').Router();
const subsectionController = require('../controller/Subsection');
const { auth, isInstructor } = require('../middlewares/auth');

router.post('/', auth, isInstructor, subsectionController.createSubSection);
router.delete('/:sectionId/:subSectionId', auth, isInstructor, subsectionController.deleteSubSection);
router.put('/:subSectionId', auth, isInstructor, subsectionController.updateSubSection);

module.exports = router;
