import {Router} from "express";
import { userLogin,findUserByID, addUser, updateUser } from "../controller/user.controller";
import { userAuth } from "../services/authService";
export const userRouter = Router();

userRouter.get('/:id',findUserByID);
userRouter.post('/add',addUser);
userRouter.post('/update', userAuth, updateUser);
userRouter.post('/login', userLogin);

