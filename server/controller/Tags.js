const {course}=require('../models/Course');
const {User}=require('../models/User');
const {Tag}=require('../models/Tag');

exports.createTag=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name || !description){
            return res.status(400).send({error:"Name and description are required"});
        }
        const tagDetails=await Tag.create({name,description});
        res.status(201).send({message:"Tag created successfully",tag:tagDetails});
    }
    catch(error){
        res.ststus(500).send({error:"Error creating tag"});
    }
};

exports.getAllTags=async(req,res)=>{
    try{
        const alltags=await tag.find({},{name:true,description:true});
        res.status(200).json({
            sucess:true,
            message:"sucessfully got all the tags",
            alltags
        });
    }
    catch(error){
        res.status(500).send({error:"error while getting all tags"});
    }
};