import { Router } from 'express';
import { addComment ,updateComment,deleteComment, getVideoComments} from '../controllers/comment.controller.js';
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId")
.post(addComment)
.get(getVideoComments);

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);


export default router