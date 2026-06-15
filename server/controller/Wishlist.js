const Wishlist = require("../models/Wishlist");
const Course = require("../models/Course");

exports.addToWishlist = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, courses: [courseId] });
        } else {
            // FIX: ObjectId.toString() comparison — Array.includes() fails on ObjectId vs string
            const alreadyIn = wishlist.courses.some((id) => id.toString() === courseId.toString());
            if (alreadyIn) {
                return res.status(400).json({ error: 'Course already in wishlist' });
            }
            wishlist.courses.push(courseId);
            await wishlist.save();
        }

        return res.status(200).json({
            message: 'Course added to wishlist successfully',
            wishlist,
        });
    } catch (error) {
        console.error('addToWishlist error:', error);
        return res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        wishlist.courses = wishlist.courses.filter((id) => id.toString() !== courseId.toString());
        await wishlist.save();

        return res.status(200).json({
            message: 'Course removed from wishlist successfully',
            wishlist,
        });
    } catch (error) {
        console.error('removeFromWishlist error:', error);
        return res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ userId }).populate({
            path: 'courses',
            select: 'courseName price thumbnail averageRating StudentsEnrolled courseDescription',
        });

        if (!wishlist) {
            return res.status(200).json({
                message: 'Wishlist is empty',
                wishlist: { courses: [] },
            });
        }

        return res.status(200).json({
            message: 'Wishlist fetched successfully',
            wishlist,
        });
    } catch (error) {
        console.error('getWishlist error:', error);
        return res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

exports.isInWishlist = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const wishlist = await Wishlist.findOne({ userId, courses: courseId });

        return res.status(200).json({ isInWishlist: !!wishlist });
    } catch (error) {
        console.error('isInWishlist error:', error);
        return res.status(500).json({ error: 'Failed to check wishlist' });
    }
};
