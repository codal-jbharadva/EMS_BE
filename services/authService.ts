import { CustomRequest, handleResponse } from "../utils/utils";
import { Request, Response, NextFunction } from "express";

import jwt from  "jsonwebtoken"
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

export const userAuth = (req: CustomRequest, res: Response, next:NextFunction)=>{
    try{
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            return handleResponse(res, "unAuthorized User", 401)
        }
        const decodedToken = jwt.verify(token, secretKey as string) as {id: number, role:string}
        console.log(decodedToken)
        req.id = decodedToken.id;
        req.role = decodedToken.role;
        next()
    }
    catch{
        return handleResponse(res, "Token Not Valid", 401);
    }
}

export const AuthorizeAdmin = (req:CustomRequest, res:Response, next:NextFunction)=>{
    if(req.role !== "admin"){
        return handleResponse(res, "UnAuthorized User", 401);
    }
    next();
}
