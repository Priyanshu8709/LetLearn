const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    message:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["pending","answered"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
module.exports=mongoose.model('Inquiry', InquirySchema);