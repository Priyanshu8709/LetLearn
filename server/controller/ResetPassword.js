import {mailSender} from '../utils/mailSender.js';
const user = require("../models/User");;
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.resetPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const existingUser=await user.findOne({email});
        if(!existingUser){
            return res.status(404).send({error:"User not found"});
        }
        const token=crypto.randomUUID();
        const updateUser=await user.findByIdAndUpdate(existingUser._id,{
            token:token,resetPasswordExpires:Date.now()+3600000},{new:true});
        const resetLink=`${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await mailSender(email,"Password Reset Request",`Click the link to reset your password: ${resetLink}`);
        res.status(200).send({message:"Password reset link sent to your email"});
    }
    catch(e){
        res.status(500).send({error:"Error sending password reset email"});
    }
};

exports.updatePassword=async(req,res)=>{
    try{
        const {token,newPassword}=req.body;
        if(!token || !newPassword){
            return res.status(400).send({error:"Token and new password are required"});
        }
        const existingUser=await user.findOne({token:token});

        if(!existingUser){
            return res.status(400).send({error:"Invalid or expired token"});
        }
        if(existingUser.resetPasswordExpires< Date.now()){
            return res.status(400).send({error:"Token has expired"});
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        existingUser.password=hashedPassword;
        existingUser.token=undefined;
        existingUser.resetPasswordExpires=undefined;
        await existingUser.save();
        res.status(200).send({message:"Password updated successfully"});
    }
    catch(e){
        res.status(500).send({error:"Error updating password"});
    }
};