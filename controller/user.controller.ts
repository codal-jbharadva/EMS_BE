import { Request, Response } from "express";
import { CustomRequest, handleResponse } from "../utils/utils";
import bcrypt from "bcryptjs";
require("dotenv").config();
const db = require('../utils/database');
const jwt = require("jsonwebtoken");

interface user {
    name: string,
    email: string,
    password?: string,
    role?:string,
    number?:number
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(email)
    if (!email || !password) {
        return handleResponse(res, "Email and password are required", 400);
    }

    try {
        const [users] = await db.execute("SELECT * FROM user WHERE email = ?", [email]);
        
        if (users.length === 0) {
            return handleResponse(res, "Invalid email or password", 401); 
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return handleResponse(res, "Invalid email or password", 401);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role},
            JWT_SECRET,
            { expiresIn: "1h" } 
        );

        return handleResponse(res, "Login successful", 200, token);
    } catch (err) {
        console.error("Error during user login:", err);
        return handleResponse(res, "Internal Server Error", 500);
    }
}

export async function addUser(req:Request, res:Response){
    const body = req.body as user;
    if (!body.password) {
        return handleResponse(res, "Password is required", 400);
    }
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(body.password, saltRounds);

        db.execute(
            "INSERT INTO user (name, email, password,number, role) VALUES (?, ?, ?, ?, ?)",
            [body.name, body.email, hashedPassword, body.number, body.role]
        )
        .then((result: any) => {
            return handleResponse(res, "User Added Successfully", 201);
        })
        .catch((err: any) => {
            console.error("Error adding user:", err);
            return handleResponse(res, "User is not added", 400);
        });
    } catch (err) {
        console.error("Error hashing password:", err);
        return handleResponse(res, "Internal Server Error", 500);
    }
}      

export async function updateUser(req:CustomRequest, res:Response){
    const body = req.body as user;
    const id = req.id;
    console.log(id);
    const query = "update user set name = ?, email = ?, password = ? where id = ?"
    db.execute(query,[body.name, body.email, body.password, id])
    .then((result:any) => {
        if (result.affectedRows === 0) {
            return handleResponse(res, "User not Found",404);
        }
        return handleResponse(res,"User Updated Successfully", 201)
    }).catch((err:any) => {
        console.log(err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return handleResponse(res, "User Not Found", 400);
        } else if (err.code === 'ER_DUP_ENTRY') {
            return handleResponse(res, "Email already in use", 409);
        }
        return handleResponse(res, "Internal Server Error",500);
    });
}

export async function findUserByID(req:Request, res:Response){
    const id = req.params.id;
    db.execute(`select * from user where id = ${id}`)
    .then((result:any) => {
        if(result[0].length === 0){
            return handleResponse(res, "User Not found",404);
        }
        return handleResponse(res, "User Found", 200, undefined, result[0], "data");
    }).catch((err:any) => {
        console.log(err);
    });
}


