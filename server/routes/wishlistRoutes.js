const router = require('express').Router();
const wishlistController = require('../controller/Wishlist');
const { auth, isStudent } = require('../middlewares/auth');

router.post('/', auth, isStudent, wishlistController.addToWishlist);
router.delete('/:courseId', auth, isStudent, wishlistController.removeFromWishlist);
router.get('/', auth, isStudent, wishlistController.getWishlist);
router.get('/check/:courseId', auth, isStudent, wishlistController.isInWishlist);

module.exports = router;
