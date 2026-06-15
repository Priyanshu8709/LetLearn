const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!courseId || !sectionName) {
            return res.status(400).json({ error: 'Course ID and section name are required' });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const newSection = await Section.create({ sectionTitle: sectionName, subSections: [] });

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { sections: newSection._id } },
            { new: true }
        );

        return res.status(201).json({
            message: 'Section created successfully',
            section: newSection,
            course: updatedCourse,
        });
    } catch (error) {
        console.error('createSection error:', error);
        return res.status(500).json({ error: 'Failed to create section' });
    }
};

exports.updateSection = async (req, res) => {
    try {
        // sectionId can come from params or body
        const sectionId = req.params.sectionId || req.body.sectionId;
        const { sectionName } = req.body;

        if (!sectionId || !sectionName) {
            return res.status(400).json({ error: 'Section ID and name are required' });
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionTitle: sectionName },
            { new: true }
        );
        if (!updatedSection) return res.status(404).json({ error: 'Section not found' });

        return res.status(200).json({ message: 'Section updated successfully', section: updatedSection });
    } catch (error) {
        console.error('updateSection error:', error);
        return res.status(500).json({ error: 'Failed to update section' });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        if (!sectionId) return res.status(400).json({ error: 'Section ID is required' });

        const section = await Section.findById(sectionId);
        if (!section) return res.status(404).json({ error: 'Section not found' });

        // Cascade: delete all child subsections
        if (section.subSections?.length) {
            await SubSection.deleteMany({ _id: { $in: section.subSections } });
        }

        // Remove from parent course
        await Course.findOneAndUpdate(
            { sections: sectionId },
            { $pull: { sections: sectionId } }
        );

        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({ message: 'Section and its subsections deleted successfully' });
    } catch (error) {
        console.error('deleteSection error:', error);
        return res.status(500).json({ error: 'Failed to delete section' });
    }
};
