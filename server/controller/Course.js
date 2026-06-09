const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { uploadImageToCloud } = require("../utils/imageUploader");

exports.createCourse=async(req,res)=>{
    try{
        const{courseName,courseDescription,whatYouwillLearn,price,tag}=req.body;
        const tumbnail=req.files.thumbnailImage;
        if(!courseName || !courseDescription || !whatYouwillLearn || !price || !tag || !tumbnail){
            return res.status(400).json({
                sucess:false,
                message:"Enter valid data, all fiels are required"
            });
        }
        const userID=req.user.id;
        const instructor=await User.findById(userID);
        if(!instructor.accountType=="instrctor"){
            return res.status(404).json({
                sucess:false,
                message:"You are not the instructor"
            });
        }
        const tagDetails=await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                sucess:false,
                message:"Invalid tag"
            });
        }
        try{
            const thumbnailImage=await uploadImageToCloud(tumbnail,process.env.FOLDER_NAME);
        }catch(erorr){
            console.error(error);
            return res.status(500).json({
                message:"Error while uploading thumbnail to cloud",
                error:error.message
            })
        }
        const newCourse = await Course.create({
            courseName,
            instructor:instructor._id,
            courseDescription,
            whatYouwillLearn,
            price,
            tag:tagDetails._id,
            tumbnail:thumbnailImage.secure_url,
        });
        await User.findByIDAndUpdate(
            {_id:instructor._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        );

        await Tag.findByIDAndUpdate(
            {_id:tagDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        );
        return res.status(200).json({
            sucess:true,
            message:"New Cousre Created SucessFully",
            data:newCourse
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json(
            {
                sucess:false,
                message:"Error while creating a new Course",
                erroe:error.message
            }
        )
    }
};

exports.getAllCourse=async(req,res)=>{
    try{
        const allCourses=await courses.find({},{
            courseName:true,
            courseDescription:true,
            price:true,
            thumbnail:true,
            whatYouWillLearn:true,
            instructor:true,
            RatingAndReview:true,
            StudentsEnrolled:true,
            tag:true
            .populate("instructor").exec()
        });
        return res.status(200).json({
            sucess:true,
            message:"Sucessfully Got all the Data",
            data:allCourses
        });
    }
    catch(error){
        return res.status(500).json(
            {
                sucess:false,
                message:"error while getting all the courses",
                error:error.message

            }
        )
    }
};

exports.getCourseDetails=async(req,res)=>{
    try{
        const courseID=req.params.id;
        const courseDetails=await Course.findById(courseID)
        .populate("instructor")
        .populate("RatingAndReview")
        .populate("StudentsEnrolled")
        .populate("tag");
         if(!courseDetails){
            return res.status(404).json({
                sucess:false,
                message:"Course not found"
            });
        }
        return res.status(200).json({
            sucess:true,
            message:"Sucessfully Got the Course Details",
            data:courseDetails
        });
    }
    catch(error){
        return res.status(500).json(
            {
                sucess:false,
                message:"error while getting course details",
                error:error.message
            }
        );
    }
};

exports.updateCourse=async(req,res)=>{
        try{
        const courseID=req.params.id;
        const {courseName,courseDescription,whatYouwillLearn,price,tag}=req.body;
        if(!courseName || !courseDescription || !whatYouwillLearn || !price || !tag){
            return res.status(400).json({
                sucess:false,
                message:"Enter valid data, all fiels are required"
            });
        }
        const courseDetails=await Course.findById(courseID);
        if(!courseDetails){
            return res.status(404).json({
                sucess:false,
                message:"Course not found"
            });
        }
            const userID=req.user.id;
            const instructor=await User.findById(userID);
            if(!instructor.accountType=="instrctor"){
                return res.status(404).json({
                    sucess:false,
                    message:"You are not the instructor"
                });
            }
            const tagDetails=await Tag.findById(tag);
            if(!tagDetails){
                return res.status(404).json({
                    sucess:false,
                    message:"Invalid tag"
                });
            }
            const updatedCourse=await Course.findByIdAndUpdate(
                {_id:courseID},
                {
                    courseName,
                    courseDescription,
                    whatYouwillLearn,
                    price,
                    tag:tagDetails._id,
                },
                {new:true}
            );
            return res.status(200).json({
                sucess:true,
                message:"Course updated successfully",
                data:updatedCourse
            });

        }    
        catch(error){
        console.error(error);
        res.status(500).json(
            {
                sucess:false,
                message:"Error while updating the course",
                error:error.message
            }
        )
    }
};

exports.deleteCourse=async(req,res)=>{
    try{
        const courseID=req.params.id;
        const courseDetails=await Course.findById(courseID);
        if(!courseDetails){
            return res.status(404).json({
                sucess:false,
                message:"Course not found"
            });
        }
        const userID=req.user.id;
        const instructor=await User.findById(userID);
        if(!instructor.accountType=="instrctor"){
            return res.status(404).json({
                sucess:false,
                message:"You are not the instructor"
            });
        }
        await Course.findByIdAndDelete(courseID);
        await User.findByIdAndUpdate(
            {_id:instructor._id},
            {
                $pull:{
                    courses:courseID
                }
            },
            {new:true}
        );
        await Tag.findByIdAndUpdate(
            {_id:courseDetails.tag},
            {
                $pull:{
                    courses:courseID
                }
            },
            {new:true}
        );
        return res.status(200).json({
            sucess:true,
            message:"Course deleted successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Error while deleting the course",
            error:error.message
        });
    }
};

exports.enrollCourse=async(req,res)=>{
    try{
        const courseID=req.params.id;
        const courseDetails=await Course.findById(courseID);
        if(!courseDetails){
            return res.status(404).json({
                sucess:false,
                message:"Course not found"
            });
        }
        const userID=req.user.id;
        const student=await User.findById(userID);
        if(!student.accountType=="student"){
            return res.status(404).json({
                sucess:false,
                message:"You are not the student"
            });
        }
        await Course.findByIdAndUpdate(
            {_id:courseID},
            {
                $push:{
                    StudentsEnrolled:student._id
                }            },
            {new:true}
        );
        student.courses.push(courseID);
        await student.save();
        return res.status(200).json({
            sucess:true,
            message:"Course enrolled successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Error while enrolling the course",
            error:error.message
        });
    }
};

exports.getInstructorCourses=async(req,res)=>{
    try{
        const userID=req.user.id;
        const instructor=await User.findById(userID);
        if(!instructor.accountType=="instrctor"){
            return res.status(404).json({
                sucess:false,
                message:"You are not the instructor"
            });
        }
        const courses=await Course.find({instructor:instructor._id});
        return res.status(200).json({
            sucess:true,
            message:"Sucessfully got the instructor courses",
            data:courses
        });
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Error while getting instructor courses",
            error:error.message
        });
    }
};

exports.getStudentCourses=async(req,res)=>{
    try{
        const userID=req.user.id;
        const student=await User.findById(userID);
        if(!student.accountType=="student"){
            return res.status(404).json({
                sucess:false,
                message:"You are not the student"
            });
        }
        const courses=await Course.find({_id:{$in:student.courses}});
        return res.status(200).json({
            sucess:true,
            message:"Sucessfully got the student courses",
            data:courses
        });
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Error while getting student courses",
            error:error.message
        });
    }
};

exports.getTopRatedCourses=async(req,res)=>{
    try{
        const topRatedCourses=await Course.find({}).sort({averageRating:-1}).limit(10);
        return res.status(200).json({
            sucess:true,
            message:"Sucessfully got the top rated courses",
            data:topRatedCourses
        });
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Error while getting top rated courses",
            error:error.message
        });
    }
};

exports.getCoursesByTag=async(req,res)=>{
    try{
        const tagID=req.params.tagID;
        const courses=await Course.find({tag:tagID});
        return res.status(200).json({
            sucess:true,
            message:"Sucessfully got the courses by tag",
            data:courses
        });
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Error while getting courses by tag",
            error:error.message
        });
    }
};

exports.enableDisableCourse=async(req,res)=>{
    try{
        const courseID=req.params.id;
        const courseDetails=await Course.findById(courseID);
        if(!courseDetails){
            return res.status(404).json({
                sucess:false,
                message:"Course not found"
            });
        }
        const userID=req.user.id;
        const instructor=await User.findById(userID);
        if(!instructor.accountType=="instrctor"){
            return res.status(404).json({
                sucess:false,
                message:"You are not the instructor"
            });
        }
        courseDetails.active=!courseDetails.active;
        await courseDetails.save();
        return res.status(200).json({
            sucess:true,
            message:`Course ${courseDetails.active?"enabled":"disabled"} successfully`,
            data:courseDetails
        });
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Error while enabling/disabling the course",
            error:error.message
        });
    }
};