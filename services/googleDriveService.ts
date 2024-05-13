import {google} from "googleapis";

export const authenticGoogle = ()=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: `D:\\ServiceAccountCred.json`,
        scopes: "https://www.googleapis.com/auth/drive",
    })
    return auth;
}