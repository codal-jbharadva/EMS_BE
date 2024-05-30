import {Router} from "express";
import { userLogin,findUserByID, addUser, updateUser } from "../controller/user.controller";
import { userAuth } from "../services/authService";
import { upload } from "../middleware/upload";
export const userRouter = Router();

userRouter.get('/:id',findUserByID);
userRouter.post('/add',upload.single("profilePhoto"), addUser);
userRouter.post('/update', userAuth, updateUser);
userRouter.post('/login', userLogin);

