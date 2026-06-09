InquirySchema=new mongoose.Schema({
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
});
module.exports=mongoose.model('Inquiry', InquirySchema);