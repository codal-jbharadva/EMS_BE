import { Router } from "express";


import { addEvent, updateEvent, deleteEvent, getEventByID, getAllEvents, getImages } from "../controller/event.controller";
import { AuthorizeAdmin, userAuth } from "../services/authService";
import { upload } from "../middleware/upload";
export const eventRouter = Router();

eventRouter.post('/add', userAuth, AuthorizeAdmin, upload.array('photos'), addEvent);
eventRouter.get('/',getAllEvents);
eventRouter.get('/:id',getEventByID)
eventRouter.post('/update/:id',updateEvent);
eventRouter.delete('/delete',deleteEvent); // in this we are not actually deleting event but we are making it not visible
eventRouter.get('/getimage/:id',getImages);
// search filter


// evem type add