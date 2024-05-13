import {Request,Response} from "express";

export const handleResponse = (
    res: Response, 
    message : string,
    status: number,
    token? : string,
    item? : any,
    itemName: string = 'item',
)=>{
    const responseObj: {message: string, Token? : string, [key: string]: any} = {message};

    if(token){
        responseObj.Token = token;
    }else if(item !== undefined){
        responseObj[itemName] = item
    }
    return res.status(status).json(responseObj);
}

export interface CustomRequest extends Request{
    id?:number,
    role?:string
}