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
});

module.exports=mongoose.model("SubSection",exports.SubSectionSchema);