import { Request, Response } from "express";
import { CustomRequest, handleResponse } from "../utils/utils";
import { uploadToGoogleDrive } from "../utils/uploadToGoogleDrive";
import { uploadFile } from "../services/cloudinaryUploadservice";
const db = require('../utils/database');

export async function addBlog(req: CustomRequest, res: Response) {
    console.log("add")
    try {
        const { title, slug, content,description} = req.body;
        const auther = req.id;
        const file = req.file as any;
        console.log(file);

        const headerImageFilename = file.originalname + Date.now();
        // const response = await uploadToGoogleDrive(file, headerImageFilename);
        let response;
        if(req.file){
          response = await uploadFile(req?.file?.path);
        }

        const result = await db.execute(
          "INSERT INTO Blogs (title, slug, description, content, coverImage, author) VALUES (?, ? , ?, ?, ?, ?)",
          [title, slug, description, content, response?.secure_url, auther]
        );
        console.log(result)
        return handleResponse(res, "Blog added successfully", 200);
      } catch (error) {
        console.error("Error adding blog:", error);
        return handleResponse(res, "Internal server error", 500);
      }
}

export async function getBlog(req:CustomRequest, res:Response){
  const {id} = req.params;
  try{
    const result = await db.execute(
      "select * from blogs where id = ?",[id],
    )
    if(result[0].length===0){
      return handleResponse(res, "Blog not Found", 400);
    }
    handleResponse(res, "Blog Successfully found", 200,undefined, result[0][0],"data");
  }
  catch(err){
    console.log(err)
    handleResponse(res, "internal server error", 400);
  }

}

export async function getAllBlog(req:CustomRequest, res:Response){
  const {id} = req.params;
  try{
    const result = await db.execute(
      "select * from blogs",
    )
    if(result[0].length===0){
      return handleResponse(res, "Blog not Found", 400);
    }
    handleResponse(res, "Blog Successfully found", 200,undefined, result[0],"data");
  }
  catch(err){
    console.log(err)
    handleResponse(res, "internal server error", 400);
  }

}