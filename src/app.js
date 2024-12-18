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

app.use(express.json({limit: "32kb"}));
app.use(express.urlencoded({extended: true , limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// routes import
import userRouter from './routes/user.routes.js';
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import healthRouter from "./routes/healthCheck.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
// routes decleration
// issted of app.get() we have to user app.use() because we are importing route from other file from other file
app.use("/api/v1/users" , userRouter);

app.use("/api/v1/tweets" , tweetRouter);
app.use("/api/v1/videos" , videoRouter);
app.use("/api/v1/comments" , commentRouter);
app.use("/api/v1/likes" , likeRouter);
app.use("/api/v1/playlist" , playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/dashboard" , dashboardRouter);

// https://localhost:8000/api/v1/users/register



export {app};