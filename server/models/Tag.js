const mongoose = require("mongoose");
exports.TagSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:false,
        trim:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    }
});

module.exports=mongoose.model("Tag",exports.TagSchema);