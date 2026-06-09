const mailSender = require("../utils/mailSender");
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

async function createOtp(email, otp) {
    try {
       const mailResponse = await mailSender(email, "Your OTP", `Your OTP is: ${otp}`);
    }
    catch (error) {
        console.error("Error saving OTP:", error);
    }
}
OtpSchema.pre("save", async function(next) {
    await createOtp(this.email, this.otp);
    next();
});
module.exports = mongoose.model("Otp", OtpSchema);