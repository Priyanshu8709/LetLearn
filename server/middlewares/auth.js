const jwt=require('jsonwebtoken');
const User = require('../models/User');
exports.auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization')?.replace('Bearer ','');
        if(!token){
            return res.status(401).send({error:'Please authenticate.'});
        }
        try{
            const decoded=await jwt.verify(token,process.env.JWT_SECRET);
            const user=await User.findById(decoded.id);
            if(!user){
                return res.status(401).send({error:'Please authenticate.'});
            }
            req.token=token;
            req.user=user;
            next();
        }catch(e){
            return res.status(401).send({error:'Please authenticate.'});
        }
    }catch(e){
        res.status(401).send({error:'Please authenticate.'});
    }
};

exports.isStudent=async(req,res,next)=>{
    try{

        if(!req.user.accountType.includes('student')){
            return res.status(401).send({error:'Please authenticate.'});
        }
        next();
    }
    catch(e){
        res.status(401).send({error:'Please authenticate.'});
    }
};

exports.isInstructor=async(req,res,next)=>{
    try{
        if(!req.user.accountType.includes('instructor')){
            return res.status(401).send({error:'Please authenticate.'});
        }
        next();
    }
    catch(e){
        res.status(401).send({error:'Please authenticate.'});
    }
};

exports.isAdmin=async(req,res,next)=>{
    try{
        if(!req.user.accountType.includes('admin')){
            return res.status(401).send({error:'Please authenticate.'});
        }
        next();
    }
    catch(e){
        res.status(401).send({error:'Please authenticate.'});
    }
};