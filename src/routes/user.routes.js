import { Router } from "express";
import { 
    registerUser,
    loggedInUser, 
    loggedOutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory
} from "../controllers/user.controller.js";
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

// secured rout  ->> adding authentication middleware
// router.route("/logout").post(MiddleWare1 , Middleware2, ... , MiddlewareN,loggedOutUser);
router.route("/logout").post(verifyJWT,loggedOutUser);
router.route("/refresh-token").post(refreshAccessToken);

// change password
router.route("/change-password").post(verifyJWT , changeCurrentPassword);


router.route("/current-user").get(verifyJWT , getCurrentUser);

router.route("/update-account-details").patch(verifyJWT , updateAccountDetails);

router.route("/update-user-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar);

router.route("/update-user-coverImage").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage);


router.route("/c/:userName").get(verifyJWT,getUserChannelProfile);

router.route("/history").get(verifyJWT , getWatchHistory);
export default router;
