const router = require('express').Router();
const ratingController = require('../controller/Ratingandreview');
const { auth } = require('../middlewares/auth');

router.post('/', auth, ratingController.addRatingAndReview);
router.get('/:courseId', ratingController.getRatingsAndReviews);
router.delete('/:courseId', auth, ratingController.deleteRatingAndReview);

module.exports = router;
