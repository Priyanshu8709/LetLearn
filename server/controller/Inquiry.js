const Inquiry=require("../models/Inquiry");
const {User}=require("../models/user");

exports.createInquiry=async(req,res)=>{
    try{
        const { courseId, message } = req.body;
        const UserId = req.user.id; // Assuming user ID is available in the request object
         if(!UserId || !message){
            return res.status(400).json({ error: 'User ID and message are required' });
        }
        const user = await User.findById(UserId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        if(User.accountType.includes('instructor')){
            return res.status(403).json({ error: 'Instructors are not allowed to create inquiries' });
        }
        const inquiry = new Inquiry({ UserId, courseId, message });
        await inquiry.save();
        res.status(201).json({ message: 'Inquiry created successfully' });
    }
    catch(error){
        res.status(500).json({ error: 'Failed to create inquiry' });
    }
};

exports.getInquiries=async(req,res)=>{
    try{
        const { courseId } = req.params;
        const userId = req.user.id; // Assuming user ID is available in the request object
        if(!userId){
            return res.status(404).json({ error: 'User ID is missing' });
        }
        if(!courseId){
            return res.status(400).json({ error: 'Course ID is required' });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        if(!user.accountType.includes('instructor')){
            return res.status(403).json({ error: 'Only instructors can view inquiries' });
        }
        const inquiries = await Inquiry.find({ courseId, UserId: userId }).populate('UserId').populate('courseId');
        res.status(200).json({ inquiries });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
};

exports.getAllInquiries=async(req,res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        if(!user.accountType.includes('instructor')){
            return res.status(403).json({ error: 'Only instructors can view all inquiries' });
        }
        const inquiries = await Inquiry.find().populate('UserId').populate('courseId');
        res.status(200).json({ inquiries });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
};

exports.deleteInquiry=async(req,res)=>{
    try{
        const { inquiryId } = req.params;
        const userId = req.user.id;
        if(!userId){
            return res.status(404).json({ error: 'User ID is missing' });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        if(!user.accountType.includes('instructor')){
            return res.status(403).json({ error: 'Only instructors can delete inquiries' });
        }
        if(!inquiryId){
            return res.status(400).json({ error: 'Inquiry ID is required' });
        }
        const inquiry = await Inquiry.findByIdAndDelete(inquiryId);
        if(!inquiry){
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        res.status(200).json({ message: 'Inquiry deleted successfully' });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to delete inquiry' });
    }
};