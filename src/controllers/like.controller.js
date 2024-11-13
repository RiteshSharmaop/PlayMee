import { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";


// Tested
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(404 , "Video Id Not Found");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, " Video Not Found");
    }
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy:req.user._id});
    // console.log(existingLike);
    
    if(existingLike){
        const unLiked = await Like.deleteOne({
            video: videoId,
            likedBy: req.user._id
        });
        
        if(!unLiked){
            throw new ApiError(402 , "Error while doing Video Un Like")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Toggle Video Like(Dislike)")
        )
    }
    
    const like = await Like.create({
        video: videoId,
        likedBy: req.user?._id
    });
    like.save();
    
        
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Toggle Video Like")
    )

});
// Tested
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(404 , "Tweet Id Not Found");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, " Tweet Not Found");
    }
    const like = await Like.findOne({
        tweet: tweetId,
        likedBy:req.user._id
    });
    if(!like){
        const liked = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        });
        liked.save();
    }else {
        const unLiked = await Like.deleteOne({
            tweet: tweetId,
            likedBy:req.user._id
        });
        if(!unLiked){
            throw new ApiError(402 , "Error while doing Tweet Like")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Toggle Tweet Like(Dislike)")
        )
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Toggle Tweet Like")
    )
});
// Tested 
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(404 , "Comment Id Not Found");
    }
    
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, " Comment Not Found");
    }
    const like = await Like.findOne({
        comment: commentId,
        likedBy:req.user._id
    });
    if(!like){
        const liked = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        });
        liked.save();
    }else {
        const unLiked = await Like.deleteOne({
            comment: commentId,
            likedBy:req.user._id
        });
        if(!unLiked){
            throw new ApiError(402 , "Error while doing Comment Like")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Toggle Comment Like(Dislike)")
        )
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Toggle Comment Like")
    )

})
const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const like = await Like.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

})
export {
    toggleVideoLike,
    toggleTweetLike,
    toggleCommentLike
}
