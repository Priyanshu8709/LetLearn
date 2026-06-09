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
        profile.dob=dob;
        profile.about=about;
        profile.contactNumber=contactNumber;
        profile.gender=gender;
        await profile.save();   
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
        const userId = req.user.id; // Assuming user ID is available in the request object
        if(!userId){
            return res.status(404).json({ error: 'User ID is missing' });
        }
        //cronet job can be implemented to delete user data after a certain period instead of deleting it immediately
        const profileId=user.additionalDetails;
        await Profile.findByIdAndDelete(profileId);
        //unenroll user from all courses and delete progress (to be implemented)
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch(error){
        return res.status(500).json({ error: 'Failed to delete user' });
    }
};