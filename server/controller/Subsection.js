const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const { uploadFileToCloud } = require('../utils/imageUploader');

exports.createSubSection = async (req, res) => {
    try{
        const{sectionId,title,timeDuration,description} = req.body;
        const video=req.files.videoFile;
        if(!sectionId || !title || !timeDuration || !video || !description){
            return res.status(404).json({ error: 'Missing required fields' });
        }
        
        try{
            const videoUrl = await uploadFileToCloud(video);
        }
        catch(error){
            return res.status(500).json({ error: 'Video upload failed' });
        }
        const newSubSection =await SubSection.create({ 
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl: videoUrl,
        });

        const section = await Section.findByIdAndUpdate(sectionId, { $push: { subSections: newSubSection } }, { new: true });
        if(!section){
            return res.status(404).json({ error: 'Section not found' });
        }
        return res.status(201).json({ message: 'Subsection created successfully', subsection: newSubSection });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to create subsection' });
    }
};

exports.deleteSubSection = async (req, res) => {
    try{
        const {sectionId,subSectionId} = req.params;
        if(!sectionId || !subSectionId){
            return res.status(404).json({ error: 'Section ID or Subsection ID is missing' });
        }
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({ error: 'Subsection not found' });
        }
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({ error: 'Section not found' });
        }
        const foundSubSection = section.subSections.id(subSectionId);
        if(!foundSubSection){
            return res.status(404).json({ error: 'Subsection not found' });
        }
        await SubSection.findByIdAndDelete(subSectionId);
        section.subSections.pull(subSectionId);
        await section.save();
        return res.status(200).json({ message: 'Subsection deleted successfully' });
    }catch(error){
        return res.status(500).json({ error: 'Failed to delete subsection' });
    }
};

exports.updateSubSection = async (req, res) => {
    try{
        const {subSectionId,title,timeDuration,description} = req.body;
        const video=req.files?.videoFile;
        if(!subSectionId || !title || !timeDuration || !description){
            return res.status(404).json({ error: 'Missing required fields' });
        }
        const updateData = {
            title:title,
            timeDuration:timeDuration,
            description:description,
        };

        if(video){
            try{
                const videoUrl = await uploadFileToCloud(video);
                updateData.videoUrl = videoUrl;
            }
            catch(error){
                return res.status(500).json({ error: 'Video upload failed' });
            }
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, updateData, { new: true });

        if(!updatedSubSection){
            return res.status(404).json({ error: 'Subsection not found' });
        }

        return res.status(200).json({ message: 'Subsection updated successfully', subsection: updatedSubSection });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to update subsection' });
    }
};