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
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }],
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

module.exports=mongoose.model("Tag",exports.TagSchema);