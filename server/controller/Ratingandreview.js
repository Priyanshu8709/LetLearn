const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// Helper: recalculate and save averageRating on the Course document
const recalcAverageRating = async (courseId) => {
    const result = await RatingAndReview.aggregate([
        { $match: { course: courseId } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const avg = result.length ? parseFloat(result[0].avg.toFixed(2)) : 0;
    await Course.findByIdAndUpdate(courseId, { averageRating: avg });
    return avg;
};

exports.addRatingAndReview = async (req, res) => {
    try {
        const { courseId, rating, review } = req.body;
        const userId = req.user.id;

        if (!courseId || !rating || !review) {
            return res.status(400).json({ error: 'Course ID, rating, and review are required' });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // Allow multiple reviews per user — no duplicate check
        const savedRating = await RatingAndReview.create({
            rating, review, user: userId, course: courseId,
        });

        await Course.findByIdAndUpdate(courseId, {
            $push: { RatingAndReview: savedRating._id },
        });

        const newAvg = await recalcAverageRating(courseId);

        return res.status(201).json({
            message: 'Rating and review added successfully',
            ratingAndReview: savedRating,
            newAverageRating: newAvg,
        });
    } catch (error) {
        console.error('addRatingAndReview error:', error);
        return res.status(500).json({ error: 'Failed to add rating and review' });
    }
};

exports.getRatingsAndReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) return res.status(400).json({ error: 'Course ID is required' });

        // Fix: populate firstname + lastname, not 'name'
        const ratingsAndReviews = await RatingAndReview.find({ course: courseId })
            .populate('user', 'firstname lastname images')
            .sort({ createdAt: -1 });

        return res.status(200).json({ ratingsAndReviews });
    } catch (error) {
        console.error('getRatingsAndReviews error:', error);
        return res.status(500).json({ error: 'Failed to fetch ratings and reviews' });
    }
};

exports.deleteRatingAndReview = async (req, res) => {
    try {
        // Support both /ratings/:courseId (old) and /ratings/review/:reviewId (new)
        const reviewId = req.params.reviewId;
        const courseId = req.params.courseId;
        const userId   = req.user.id;

        let ratingAndReview;

        if (reviewId) {
            // Delete a specific review by its _id (enforcing ownership)
            ratingAndReview = await RatingAndReview.findOneAndDelete({ _id: reviewId, user: userId });
        } else {
            // Fallback: delete most recent review for this course by this user
            ratingAndReview = await RatingAndReview.findOneAndDelete(
                { course: courseId, user: userId },
                { sort: { createdAt: -1 } }
            );
        }

        if (!ratingAndReview) {
            return res.status(404).json({ error: 'Rating and review not found' });
        }

        await Course.findByIdAndUpdate(ratingAndReview.course, {
            $pull: { RatingAndReview: ratingAndReview._id },
        });

        await recalcAverageRating(ratingAndReview.course);

        return res.status(200).json({ message: 'Rating and review deleted successfully' });
    } catch (error) {
        console.error('deleteRatingAndReview error:', error);
        return res.status(500).json({ error: 'Failed to delete rating and review' });
    }
};
