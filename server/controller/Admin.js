const User = require("../models/User");
const Course = require("../models/Course");
const Inquiry = require("../models/Inquiry");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('additionalDetails')
            .populate('courses');

        return res.status(200).json({
            message: 'All users retrieved successfully',
            users: users,
            totalUsers: users.length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'firstname lastname email')
            .populate('tag', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'All courses retrieved successfully',
            courses: courses,
            totalCourses: courses.length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve courses' });
    }
};

exports.approveCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            { active: true },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        return res.status(200).json({
            message: 'Course approved successfully',
            course: course
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to approve course' });
    }
};

exports.rejectCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { reason } = req.body;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Clean up references in instructor's courses array
        if (course.instructor) {
            const User = require('../models/User');
            await User.findByIdAndUpdate(course.instructor, { $pull: { courses: courseId } });
        }

        // Clean up tag reference
        if (course.tag) {
            const Tag = require('../models/Tag');
            await Tag.findByIdAndUpdate(course.tag, { $pull: { courses: courseId } });
        }

        return res.status(200).json({
            message: 'Course rejected and deleted successfully',
            reason: reason || 'No reason provided'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to reject course' });
    }
};

exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate('UserId', 'firstname lastname email')
            .populate('courseId', 'courseName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'All inquiries retrieved successfully',
            inquiries: inquiries,
            totalInquiries: inquiries.length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve inquiries' });
    }
};

exports.getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalInstructor = await User.countDocuments({ accountType: 'instructor' });
        const totalStudents = await User.countDocuments({ accountType: 'student' });
        const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });

        const stats = {
            totalUsers,
            totalCourses,
            totalInstructor,
            totalStudents,
            pendingInquiries,
            activeCourses: await Course.countDocuments({ active: true }),
        };

        return res.status(200).json({
            message: 'Platform statistics retrieved successfully',
            stats: stats
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
};

exports.getTopCourses = async (req, res) => {
    try {
        const topCourses = await Course.find()
            .populate('instructor', 'firstname lastname')
            .sort({ averageRating: -1, 'StudentsEnrolled': -1 })
            .limit(10);

        return res.status(200).json({
            message: 'Top courses retrieved successfully',
            courses: topCourses
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve top courses' });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            message: 'User blocked successfully',
            user: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to block user' });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            message: 'User unblocked successfully',
            user: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to unblock user' });
    }
};
