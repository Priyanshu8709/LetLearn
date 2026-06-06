const mongoose = require("mongoose");

exports.ProfileSchema=new mongoose.Schema({
    gender:{
        type:String,
        enum:["male","female","other"],
        required:true,
    },
    DoB:{
        type:Date,
        required:true,
    },
    about:{
        type:String,
        required:false,
        trim:true,
    },
    contactNumber:{
        type:String,
        required:false,
    },
    address:{
        type:String,
        required:false,
        trim:true,
    },
});

module.exports=mongoose.model("Profile",exports.ProfileSchema);