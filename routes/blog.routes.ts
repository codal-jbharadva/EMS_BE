import { Router } from "express";

import { AuthorizeAdmin, userAuth } from "../services/authService";
import { upload } from "../middleware/upload";
import { addBlog, getAllBlog, getBlog } from "../controller/blog.controller";
export const blogRouter = Router();

blogRouter.post('/add',userAuth, AuthorizeAdmin, upload.single('coverImage'), addBlog);
blogRouter.get('/:id', getBlog);
blogRouter.get('/', getAllBlog);
