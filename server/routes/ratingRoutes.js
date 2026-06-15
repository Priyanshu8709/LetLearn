const router = require('express').Router();
const ratingController = require('../controller/Ratingandreview');
const { auth } = require('../middlewares/auth');

router.post('/',                      auth, ratingController.addRatingAndReview);
router.get('/:courseId',                    ratingController.getRatingsAndReviews);
router.delete('/review/:reviewId',    auth, ratingController.deleteRatingAndReview);  // delete by review _id
router.delete('/:courseId',           auth, ratingController.deleteRatingAndReview);  // legacy: delete latest

module.exports = router;
