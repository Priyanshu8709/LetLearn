const mongoose=require("mongoose");

exports.SubSectionSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    timeDuration:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:false,
        trim:true,
    },
    videoUrl:{
        type:String,
        required:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    }
});

module.exports=mongoose.model("SubSection",exports.SubSectionSchema);