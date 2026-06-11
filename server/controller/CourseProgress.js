const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const User = require("../models/User");

exports.updateProgress = async (req, res) => {
    try {
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;

        if (!courseId || !subSectionId) {
            return res.status(400).json({ error: 'Course ID and SubSection ID are required' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({ error: 'SubSection not found' });
        }

        let progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            progress = await CourseProgress.create({
                userId,
                courseId,
                completedVideos: [subSectionId],
                progressPercentage: 0,
            });
        } else {
            if (!progress.completedVideos.includes(subSectionId)) {
                progress.completedVideos.push(subSectionId);
            }
        }

        const totalSubSections = await SubSection.countDocuments({
            _id: { $in: course.sections }
        });

        progress.progressPercentage = Math.round(
            (progress.completedVideos.length / totalSubSections) * 100
        );

        await progress.save();

        return res.status(200).json({
            message: 'Progress updated successfully',
            progress: progress,
            progressPercentage: progress.progressPercentage
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update progress' });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const progress = await CourseProgress.findOne({ userId, courseId })
            .populate('completedVideos');

        if (!progress) {
            return res.status(404).json({ error: 'No progress found for this course' });
        }

        return res.status(200).json({
            message: 'Progress fetched successfully',
            progress: progress
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

exports.getAllUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const allProgress = await CourseProgress.find({ userId })
            .populate('courseId', 'courseName thumbnail price')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'All progress fetched successfully',
            progress: allProgress
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

exports.resetProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const progress = await CourseProgress.findOneAndDelete({ userId, courseId });

        if (!progress) {
            return res.status(404).json({ error: 'No progress found to delete' });
        }

        return res.status(200).json({
            message: 'Progress reset successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to reset progress' });
    }
};
