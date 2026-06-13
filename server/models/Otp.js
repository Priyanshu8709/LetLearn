const mongoose = require("mongoose");
const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
    },
    otp:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60, // OTP expires after 5 minutes
    },
});

module.exports = mongoose.model("Otp", OtpSchema);
