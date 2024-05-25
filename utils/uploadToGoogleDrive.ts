import {authenticGoogle} from "../services/googleDriveService"
import fs from "fs";
const {google} = require("googleapis");

export const uploadToGoogleDrive = async (file:any, filename:string) => {
    const auth = authenticGoogle();
    const fileMetadata = {
      name: filename,
      parents: ["1TNLtW8n_z4iHrX0tAtDUtJIRVZKyfbLy"], // Change it according to your desired parent folder id
    };
  
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
  
    const driveService = google.drive({ version: "v3", auth });
  
    const p =  driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });
    return p;
  };
