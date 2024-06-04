import { Router } from "express";

import { upload } from "../middleware/upload";
import { CreatePayment, registerUser } from "../controller/register.controller";

export const registerRouter = Router();

registerRouter.post('/register', registerUser)
registerRouter.post('/stripe', CreatePayment);


