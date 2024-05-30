import cloudinary from "./cloudinaryConfig";

export const uploadFile = async(filepath : string)=>{
    try{
        const result = cloudinary.uploader.upload(filepath);
        return result;
    }
    catch(err){
        console.log(err);
    }
}