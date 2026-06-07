const cloudinary=require('cloudinary').v2;

exports.uploadImageToCloud=async(req,res)=>{
    try{
        const options={folder};
        if(height){
            options.height=height;
        }
        if(quality){
            options.quality=quality;
        }
        options.resource_type="auto";
        return await cloudinary.uploader.upload(File.tempFilePath,options);
    }catch(error){
        console.error(error);
        res.status(500).jsob({
            sucess:false,
            message:"error while uploading to cloud",
        });
    }
};