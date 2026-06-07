const Course = require("../models/Course");
const {Tag} = require("../models/Tag");
const {User}=require("../models/User");
const { uploadImageToCloud } = require("../utils/imageUploader");
const uploadimage=rquire("../utils/imageUploader");

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



