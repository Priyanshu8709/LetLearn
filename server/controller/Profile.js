const Profile=require('../models/Profile');
const User=require('../models/User');

exports.updateProfile=async(req,res)=>{
    try{
        const {dob="",about="",contactNumber,gender} = req.body;
        const userId = req.user.id; // Assuming user ID is available in the request object
        if(!contactNumber || !gender){
            return res.status(400).json({ error: 'Contact number and gender are required' });
        }
        if(!userId){
            return res.status(404).json({ error: 'User ID is missing' });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        const profileId=user.additionalDetails;
        const profile = await Profile.findById(profileId);
        if(!profile){
            return res.status(404).json({ error: 'Profile not found' });
        }
        profile.DoB=dob;
        profile.about=about;
        profile.contactNumber=contactNumber;
        profile.gender=gender;
        const updatedProfile=await profile.save();
        return res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to update profile' });
    }
};

exports.getProfile=async(req,res)=>{
    try{
        const userId = req.user.id; // Assuming user ID is available in the request object  
        if(!userId){
            return res.status(404).json({ error: 'User ID is missing' });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        const profileId=user.additionalDetails;
        const profile = await Profile.findById(profileId);
        if(!profile){
            return res.status(404).json({ error: 'Profile not found' });
        }
        return res.status(200).json({ profile });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

exports.deleteUser=async(req,res)=>{
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(404).json({ error: 'User ID is missing' });
        }
        const userToDelete = await User.findById(userId);
        if(!userToDelete){
            return res.status(404).json({ error: 'User not found' });
        }

        // Clean up related data
        const CourseProgress = require('../models/CourseProgress');
        const Wishlist = require('../models/Wishlist');
        const Course = require('../models/Course');

        await Promise.all([
            // Delete profile
            Profile.findByIdAndDelete(userToDelete.additionalDetails),
            // Delete all progress records
            CourseProgress.deleteMany({ userId }),
            // Delete wishlist
            Wishlist.findOneAndDelete({ userId }),
            // Remove user from all enrolled courses
            Course.updateMany(
                { StudentsEnrolled: userId },
                { $pull: { StudentsEnrolled: userId } }
            ),
        ]);

        await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to delete user' });
    }
};