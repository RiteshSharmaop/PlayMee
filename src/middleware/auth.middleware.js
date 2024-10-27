import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req , res , next) => {
    try {
        // req.header  used to fetch cookis feom mobile
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.log("token ",req.cookies);
        
        if(!token){
            throw new ApiError(401 , "Unauthorized Request")
        }
    

        // decodeToke have _id which we have provided in generateAccessToken in user.model
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user) {
            throw new ApiError(401 , "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.log("error in auth");
        
        throw new ApiError(401 , error?.message || "Invalid Access Token")
    }
});

