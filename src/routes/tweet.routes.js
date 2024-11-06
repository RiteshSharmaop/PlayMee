import { Router } from "express";
import {createTweet , getUserTweets , updateTweet , deleteTweet} from "../controllers/tweets.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/ct").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);



export default router;
