const router = require('express').Router();
const sectionController = require('../controller/Section');
const { auth, isInstructor } = require('../middlewares/auth');

router.post('/', auth, isInstructor, sectionController.createSection);
router.delete('/:sectionId', auth, isInstructor, sectionController.deleteSection);
router.put('/:sectionId', auth, isInstructor, sectionController.updateSection);

module.exports = router;
