import {mailSender} from "../utils/mailSender.js";
const user = require("../models/User");;
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.sendOtp=async(req,res)=>{
    try{
        const {email}=req.body;
        const existingUser=await user.findOne({email});
        if(existingUser){
        return res.status(400).json({message:"User with this email already exists"});
        }

        const otp=OtpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        const result=await Otp.findOne({otp:otp});
        while(result){
            const otp=OtpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            const result=await Otp.findOne({otp:otp});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedOtp=await bcrypt.hash(otp,salt);
        const payload={email,otp:hashedOtp};
        const otpBody= await Otp.create(payload);
        return res.status(200).json({message:"OTP sent successfully"});
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({message:"Cannot send OTP, please try again"});
    }
};

exports.signUp=async(req,res)=>{
    try{
        const{firstname,lastname,email,password,accountType}=req.body;
        if(!firstname || !lastname || !email || !password || !accountType){ 
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await user.findOne({email});
        if(existingUser){
        return res.status(400).json({message:"User with this email already exists"});
        }
        const RecentOtp=await Otp.findOne({email}).sort({createdAt:-1}).limit(1);
        if(RecentOtp.otp==0){
            return res.status(400).json({message:"Invalid OTP"});
        }
        const isValidOtp=await bcrypt.compare(RecentOtp.otp,otp);
        if(!isValidOtp){
            return res.status(400).json({message:"Invalid OTP"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const profileDetails={
            gender:null,
            DoB:null,
            about:null,
            contactNumber:null,
            address:null,
        };
        const newUser=await user.create({
            firstname,
            lastname,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails,
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
        const recentOtp=await Otp.findOne({email}).sort({createdAt:-1}).limit(1);
        if(recentOtp){
            const isValidOtp=await bcrypt.compare(recentOtp.otp,password);
            if(!isValidOtp){
                return res.status(400).json({message:"Invalid OTP"});
            }
        }else{
            return res.status(400).json({message:"Invalid OTP"});
        } 
       
        const existingUser=await user.findOne({email});
        if(!existingUser){
        return res.status(400).json({message:"User with this email does not exist"});
        }
        if(await bcrypt.compare(password,existingUser.password)){
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
                expires:new Date(Date.now()+3*24*60*60*1000), // 3 days
            }).status(200).json({message:"Logged in successfully",user:existingUser,token});
        }
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
                `<p>Your password has been changed successfully.</p>`
            );

            return res.status(200).json({message:"Password changed successfully"});
        }
    }
    catch (err){
        console.error("Error changing password:", err);
        return res.status(500).json({message:"Cannot change password, please try again"});
    }
};