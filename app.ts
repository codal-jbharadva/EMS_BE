import express from "express";
import {userRouter} from "./routes/user.routes"
import { eventRouter } from "./routes/event.routes";
import cors from "cors"
import { blogRouter } from "./routes/blog.routes";

const PORT = 3001;

const app = express();
app.use(cors());

app.use(express.static('upload'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/blog',blogRouter);

app.use('*',(req, res)=>{
    res.status(400).json({
        message: "This route is not defined"
    })
})

app.listen(PORT, ()=>{
    console.log("server is running on port ", PORT);
});