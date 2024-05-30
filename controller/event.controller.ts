import { Request, Response } from "express";
import { CustomRequest, handleResponse } from "../utils/utils";
const db = require('../utils/database');
require("dotenv").config();
interface Event {
    name: string;
    place: string;
    start_date: Date;
    end_date: Date,
    registration_fee: string;
    details: string,
    completed: boolean,
    tagline: string,
    header_img: string,
    address:string,
    type: string,
}
import { uploadToGoogleDrive } from "../utils/uploadToGoogleDrive";
import { uploadFile } from "../services/cloudinaryUploadservice";


function convertToArray(str : String){
    return str.split(',');
}

export async function addEvent(req: CustomRequest, res: Response) {
    console.log("addvent is caaled")
    const body = req.body as Event;
    const admin_id = req.id;
    const files = req.files as { images: Express.Multer.File[], header_image: Express.Multer.File[] }

    try {
        // Prepare promises for uploading header image and event images
        const headerImageFile = files.header_image[0];
        const headerImageFilename = `header_image.png`;
        // const headerImageUploadPromise = uploadToGoogleDrive(headerImageFile, headerImageFilename);
        let headerImageUploadPromise ;
        if(headerImageFile){
            headerImageUploadPromise = uploadFile(files.header_image[0].path);
        }

        const eventImageUploadPromises: Promise<any>[] = files.images.map((file, index) => {
            // const filename = `image_${index}.png`;
            return uploadFile(file.path);
        });

        // Execute all upload promises in parallel
        const [headerImageResponse, ...googleDriveResponses] = await Promise.all([headerImageUploadPromise, ...eventImageUploadPromises]);

        const headerImageLink = {
            webViewLink: headerImageResponse?.secure_url,
        };

        const eventImageLinks = googleDriveResponses.map((response) => {
            console.log(response);
            return {
                filename: response.original_filename,
                webViewLink: response?.secure_url,
            };
        });

        // Insert event details into the event table
        const result = await db.execute(
            "INSERT INTO event (address, name, place, start_date, end_date, registration_fee, description, admin_id, header_img, tagline,type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [body.address, body.name, body.place, body.start_date, body.end_date, body.registration_fee, body.details, admin_id, headerImageLink.webViewLink, body.tagline, body.type]
        );
        const eventId = result[0].insertId;

        // Insert event images into the event_images table
        const insertImagePromises = eventImageLinks.map((link) => {
            return db.execute(
                "INSERT INTO event_images (event_id, filename, url, type) VALUES (?, ?, ?, ?)",
                [eventId, link.filename, link.webViewLink, "image/png"]
            );
        });

        await Promise.all(insertImagePromises);
        console.log("returning")

        return handleResponse(res, "Event Added Successfully", 201);
    } catch (error) {
        console.error(error);
        return handleResponse(res, "Event not added", 400);
    }
}

export async function updateEvent(req: Request, res: Response) {
    const body = req.body as Event;
    const event_id = req.params.id;
    // db.execute(
    //     "UPDATE Events SET event_name = ?, event_description = ?, event_date = ?, location = ? WHERE event_id = ?",
    //     [body.event_name, body.event_description, body.event_date, body.location, event_id]
    // )
    // .then((result: any) => {
    //     if (result.affectedRows === 0) {
    //         return handleResponse(res, "Event not found", 404);
    //     }
    //     return handleResponse(res, "Event Updated Successfully", 200);
    // })
    // .catch((err: any) => {
    //     console.error(err);
    //     return handleResponse(res, "Event update failed", 500);
    // });
}

export async function deleteEvent(req: Request, res: Response) {
    const event_id = req.params.id;
    db.execute(
        "DELETE FROM Events WHERE event_id = ?",
        [event_id]
    )
    .then((result: any) => {
        if (result.affectedRows === 0) {
            return handleResponse(res, "Event not found", 404);
        }
        return handleResponse(res, "Event Deleted Successfully", 200);
    })
    .catch((err: any) => {
        console.error(err);
        return handleResponse(res, "Event deletion failed", 500);
    });
}

export async function getEventByID(req: Request, res: Response) {
    const event_id = req.params.id;
    console.log(event_id)
    db.execute(
        "SELECT * FROM event WHERE id = ?",
        [event_id]
    )   
    .then((result: any) => {
        if (result[0].length === 0) {
            return handleResponse(res, "Event not found", 404);
        }
        return handleResponse(res, "Event Found", 200, undefined, result[0][0], "data");
    })
    .catch((err: any) => {
        console.error(err);
        return handleResponse(res, "Error fetching event", 500);
    });
}

export async function getAllEvents(req: Request, res: Response) {
    const {day, eventtype} = req.query;

    db.execute(
        "SELECT * FROM event"
    )
    .then((result: any) => {
        return handleResponse(res, "Events Retrieved Successfully", 200, undefined, result[0], "events");
    })
    .catch((err: any) => {
        console.error(err);
        return handleResponse(res, "Error fetching events", 500);
    });
}

export const getImages = (req: Request, res: Response)=>{
    const id = req.params.id;
    db.execute("select * from event_images where event_id = ?", [id])
    .then((result:any) => {
        console.log(result);
    }).catch((err:any) => {
        console.log(err)
    });
}
