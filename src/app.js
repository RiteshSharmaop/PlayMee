import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"


// create app
const app = express();


// configuration
// .use used for 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
    
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true , limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from './routes/user.routes.js';

// routes decleration
// issted of app.get() we have to user app.use() because we are importing route from other file from other file
app.use("/api/v1/users" , userRouter)

// https://localhost:8000/api/v1/users/register



export {app};