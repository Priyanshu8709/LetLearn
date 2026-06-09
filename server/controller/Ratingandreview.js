const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

exports.addRatingAndReview = async (req, res) => {
    try{
        const { courseId, rating, review } = req.body;
        const userId = req.user.id;
        if(!courseId || !rating || !review){
            return res.status(400).json({ error: 'Course ID, rating, and review are required' });
        }
        const newRatingAndReview = new RatingAndReview({
            rating: rating,
            review: review,
            user: userId,
            course: courseId
        });
        const course = await Course.findByIdAndUpdate(courseId, { 
            $push: { ratingsAndReviews: newRatingAndReview } 
        }, { new: true });
        if(!course){
            return res.status(404).json({ error: 'Course not found' });
        }
        const savedRatingAndReview = await RatingAndReview.create(newRatingAndReview);
        return res.status(201).json({ message: 'Rating and review added successfully', ratingAndReview: savedRatingAndReview });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to add rating and review' });
    }
};

exports.getRatingsAndReviews = async (req, res) => {
    try{
        const { courseId } = req.params;
        if(!courseId){
            return res.status(400).json({ error: 'Course ID is required' });
        }
        const ratingsAndReviews = await RatingAndReview.find({ course: courseId }).populate('user', 'name');
        return res.status(200).json({ ratingsAndReviews });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to fetch ratings and reviews' });
    }
};

exports.deleteRatingAndReview = async (req, res) => {
    try{
        const courseId = req.params.courseId;
        const userId = req.user.id;
        if(!courseId){
            return res.status(400).json({ error: 'Course ID is required' });
        }
        const ratingAndReview = await RatingAndReview.findOneAndDelete({ course: courseId, user: userId });
        if(!ratingAndReview){
            return res.status(404).json({ error: 'Rating and review not found' });
        }
        const course = await Course.findByIdAndUpdate(courseId, { 
            $pull: { ratingsAndReviews: ratingAndReview._id } 
        }, { new: true });
        if(!course){
            return res.status(404).json({ error: 'Course not found' });
        }   
        return res.status(200).json({ message: 'Rating and review deleted successfully' });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to delete rating and review' });
    }
};