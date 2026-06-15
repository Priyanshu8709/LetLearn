const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

// Count all subsections belonging to a course by walking sections → subSections
const countCourseSubSections = async (courseId) => {
    // Do NOT populate — keep section IDs as ObjectIds for the find query
    const course = await Course.findById(courseId).select('sections').lean();
    if (!course || !course.sections.length) return 0;

    const sections = await Section.find({ _id: { $in: course.sections } }).select('subSections').lean();
    return sections.reduce((total, s) => total + (s.subSections?.length ?? 0), 0);
};

exports.updateProgress = async (req, res) => {
    try {
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;

        if (!courseId || !subSectionId) {
            return res.status(400).json({ error: 'Course ID and SubSection ID are required' });
        }

        const [course, subSection] = await Promise.all([
            Course.findById(courseId).lean(),
            SubSection.findById(subSectionId).lean(),
        ]);
        if (!course)     return res.status(404).json({ error: 'Course not found' });
        if (!subSection) return res.status(404).json({ error: 'SubSection not found' });

        let progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            progress = await CourseProgress.create({
                userId,
                courseId,
                completedVideos: [subSectionId],
                progressPercentage: 0,
            });
        } else {
            const alreadyDone = progress.completedVideos.some(
                (v) => v.toString() === subSectionId.toString()
            );
            if (!alreadyDone) progress.completedVideos.push(subSectionId);
        }

        const totalSubSections = await countCourseSubSections(courseId);
        progress.progressPercentage = totalSubSections > 0
            ? Math.round((progress.completedVideos.length / totalSubSections) * 100)
            : 0;

        await progress.save();

        return res.status(200).json({
            message: 'Progress updated successfully',
            progress,
            progressPercentage: progress.progressPercentage,
        });
    } catch (error) {
        console.error('updateProgress error:', error);
        return res.status(500).json({ error: 'Failed to update progress' });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const progress = await CourseProgress.findOne({ userId, courseId })
            .populate('completedVideos', 'title timeDuration')
            .lean();

        if (!progress) {
            return res.status(200).json({
                message: 'No progress yet',
                progress: { completedVideos: [], progressPercentage: 0 },
            });
        }

        return res.status(200).json({ message: 'Progress fetched successfully', progress });
    } catch (error) {
        console.error('getProgress error:', error);
        return res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

exports.getAllUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const allProgress = await CourseProgress.find({ userId })
            .populate('courseId', 'courseName thumbnail price sections')
            .sort({ createdAt: -1 })
            .lean();

        // Filter out records where the course was deleted
        const valid = allProgress.filter((p) => p.courseId != null);

        return res.status(200).json({
            message: 'All progress fetched successfully',
            progress: valid,
        });
    } catch (error) {
        console.error('getAllUserProgress error:', error);
        return res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

exports.resetProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const progress = await CourseProgress.findOneAndDelete({ userId, courseId });
        if (!progress) {
            return res.status(404).json({ error: 'No progress found to reset' });
        }

        return res.status(200).json({ message: 'Progress reset successfully' });
    } catch (error) {
        console.error('resetProgress error:', error);
        return res.status(500).json({ error: 'Failed to reset progress' });
    }
};
