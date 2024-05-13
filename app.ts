import express from "express";
import {userRouter} from "./routes/user.routes"
import { eventRouter } from "./routes/event.routes";

const PORT = 3001;

const app = express();

app.use(express.static('upload'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user', userRouter);
app.use('/event', eventRouter);

app.use('*',(req, res)=>{
    res.status(200).json({
        message: "Hello"
    })
})

app.listen(PORT, ()=>{
    console.log("server is running on port ", PORT);
});