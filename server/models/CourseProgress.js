const mongoose=require("mongoose");

exports.CourseProgressSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }],
    
});

module.exports=mongoose.model("CourseProgress",exports.CourseProgressSchema);