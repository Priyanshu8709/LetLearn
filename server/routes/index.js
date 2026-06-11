const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/reset-password', require('./resetPasswordRoutes'));
router.use('/courses', require('./courseRoutes'));
router.use('/inquiries', require('./inquiryRoutes'));
router.use('/profile', require('./profileRoutes'));
router.use('/ratings', require('./ratingRoutes'));
router.use('/sections', require('./sectionRoutes'));
router.use('/subsections', require('./subsectionRoutes'));
router.use('/tags', require('./tagRoutes'));
router.use('/progress', require('./courseProgressRoutes'));
router.use('/wishlist', require('./wishlistRoutes'));
router.use('/payment', require('./paymentRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
