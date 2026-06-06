const mongoose=require("mongoose");

exports.Section=new mongoose.Schema({
    sectionTitle:{
        type:String,
        required:true,
    },
    subSections:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
        required:true,
    }],
});

module.exports=mongoose.model("Section",exports.Section);