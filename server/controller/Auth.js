const mailSender = require("../utils/mailSender");
const user = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const { otpEmail, passwordChangedEmail } = require("../templates/emailTemplates");
require("dotenv").config();

exports.sendOtp=async(req,res)=>{
    try{
        const {email}=req.body;
        const existingUser=await user.findOne({email});
        if(existingUser){
        return res.status(400).json({message:"User with this email already exists"});
        }

        let otp=OtpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        let result=await Otp.findOne({otp:otp});
        while(result){
            otp=OtpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            result=await Otp.findOne({otp:otp});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedOtp=await bcrypt.hash(otp,salt);
        const payload={email,otp:hashedOtp};
        await Otp.create(payload);
        await mailSender(
            email,
            "Verify your LetLearn email",
            otpEmail({
                otp,
                expiresInMinutes: process.env.OTP_EXPIRE || 5,
            })
        );
        return res.status(200).json({message:"OTP sent successfully"});
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({message:"Cannot send OTP, please try again"});
    }
};

exports.signUp=async(req,res)=>{
    try{
        const{firstname,lastname,email,password,otp,accountType}=req.body;
        if(!firstname || !lastname || !email || !password || !otp || !accountType){ 
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await user.findOne({email});
        if(existingUser){
        return res.status(400).json({message:"User with this email already exists"});
        }
        const RecentOtp=await Otp.findOne({email}).sort({createdAt:-1}).limit(1);
        if(!RecentOtp){
            return res.status(400).json({message:"OTP not found. Please request a new OTP."});
        }
        const isValidOtp=await bcrypt.compare(otp, RecentOtp.otp);
        if(!isValidOtp){
            return res.status(400).json({message:"Invalid OTP"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const Profile=require("../models/Profile");
        const profileDetails=await Profile.create({});
        const newUser=await user.create({
            firstname,
            lastname,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            courses:[],
            images:"https://api.dicebear.com/10.x/dylan/svg?seed=Felix",
            courseProgress:[],
        });
        res.status(201).json({message:"User created successfully",user:newUser});
    }
    catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({message:"Cannot sign up, please try again"});
    }
};

exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const existingUser=await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:"User with this email does not exist"});
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }

        const payload={
            id:existingUser._id,
            email:existingUser.email,
            role:existingUser.accountType,
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"});
        existingUser.password=undefined;
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            expires:new Date(Date.now()+3*24*60*60*1000),
        }).status(200).json({message:"Logged in successfully",user:existingUser,token});
    }
    catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({message:"Cannot log in, please try again"});
    }
};

exports.changePassword=async(req,res)=>{
    try{
        const {email,oldPassword,newPassword}=req.body;
        if(!email || !oldPassword || !newPassword){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await user.findOne({email});
        if(!existingUser){
        return res.status(400).json({message:"User with this email does not exist"});
        }
        if(await bcrypt.compare(oldPassword,existingUser.password)){
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(newPassword,salt);
            existingUser.password=hashedPassword;
            await existingUser.save();

            // Send email notification
            await mailSender(
                existingUser.email,
                "Password Changed Successfully",
                passwordChangedEmail()
            );

            return res.status(200).json({message:"Password changed successfully"});
        }
        return res.status(400).json({message:"Invalid old password"});
    }
    catch (err){
        console.error("Error changing password:", err);
        return res.status(500).json({message:"Cannot change password, please try again"});
    }
};
