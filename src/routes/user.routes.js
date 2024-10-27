import { Router } from "express";
import { registerUser , loggedInUser , loggedOutUser} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// login example
// router.route("/login").post(registerUser)
// https://localhost:8000/api/v1/users/login

// https://localhost:8000/api/v1/users/register
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(loggedInUser);

// secured rout
// router.route("/logout").post(MiddleWare1 , Middleware2, ... , MiddlewareN,loggedOutUser);
router.route("/logout").post(verifyJWT,loggedOutUser);


export default router;
