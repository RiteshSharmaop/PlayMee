import express, { urlencoded } from "express";
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

export {app};