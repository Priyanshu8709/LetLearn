const mongoose=require("mongoose");

exports.Section=new mongoose.Schema({
    sectionTitle:{
        type:String,
        required:true,
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    subSections:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
        required:true,
    }],
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

module.exports=mongoose.model("Section",exports.Section);