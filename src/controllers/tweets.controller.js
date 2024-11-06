import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Tweet }  from "../models/tweet.model.js"

import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt  from "jsonwebtoken";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body; 

    if(!content) {
        throw new ApiError(400, "write content");
    }
    const userId = req.user?._id;
    
    
    const tweet = await Tweet.create({
        content: content,
        owner: userId
    });
    // console.log(tweet);
    return res
    .status(200)
    .json(new ApiResponse(200 , {tweet} , "Tweet ceated Success fully"));
    
});
const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userId = req.user._id
    const user = await User.findById(userId)

    if(!user){
        throw new ApiResponse(404, "User Not Found");
    }

    const tweet = await Tweet.find({owner:userId});
    
    return res.status(200).json(new ApiResponse(200 , {tweet} , "User"));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = req.params;
    const { content } = req.body;

    const tweet = await Tweet.findById(tweetId);
    
    if(!tweet){
        throw new ApiError(401, "Unknon Twitter blog");
    }
    if(!content.length){
        throw new ApiError(401, "Empty Content");
    }
    const newTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content: content
            }
        }, {new : true}
    );
    // or
    // tweet.content = content;
    // const updatedTweet = await tweet.save();

    

    return res.status(200)
    .json(new ApiResponse(200 , {newTweet} , "Tweet Updated SuccessFully"));
    
    

});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    const tweet = await Tweet.findByIdAndDelete(tweetId);
    if(!tweet){
        throw new ApiError(401 , "Tweet Id not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "Tweet Is Deleted Successfully"));

})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}