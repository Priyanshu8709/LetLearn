const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;
        const course = await Course.findById(courseId);
        if (!course || !sectionName) {
            return res.status(404).json({ error: 'Course or section name is missing' });
        }
        const newSection = new Section({
            sectionTitle: sectionName,
            subSections: [],
        });
        await newSection.save();
        const UpdatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { sections: newSection._id } },
            { new: true }
        );
        res.status(201).json({ message: 'Section created successfully', section: newSection, course: UpdatedCourse });

    }
    catch(error){
        return res.status(500).json({ error: 'Failed to create section' });
    }
};

exports.deleteSection = async (req, res) => {
    try{
        const {sectionId} = req.params;
        if(!sectionId){
            return res.status(404).json({ error: 'Section ID is missing' });
        }
        const section = await Section.findByIdAndDelete(sectionId);
        if(!section){
            return res.status(404).json({ error: 'Section not found' });
        }
        res.status(200).json({ message: 'Section deleted successfully' });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to delete section' });
    }
};

exports.updateSection = async (req, res) => {
    try{
        const {sectionId,sectionName} = req.body;
        if(!sectionId || !sectionName){
            return res.status(404).json({ error: 'Section ID or name is missing' });
        }
        const Section = await Section.findByIdAndUpdate(sectionId, { sectionTitle: sectionName }, { new: true });
        if(!Section){
            return res.status(404).json({ error: 'Section not found' });
        }
        return res.status(200).json({ message: 'Section updated successfully', section: Section });

    }
    catch(error){
        return res.status(500).json({ error: 'Failed to update section' });
    }
};