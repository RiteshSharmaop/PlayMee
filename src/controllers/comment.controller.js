import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "Video Id is Invalid");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video Not Found");
    }
    const aggrigate = Comment.aggregate([
        {
            $match:  {
                video : new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $project : {
                content: 1,
                createdAt: 1,
                // "ownerDetails.userName": 1,
                "ownerDetails.userName":1,
                "ownerDetails.avatar":1

            }
        }
    ]);
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };
    const comments = await Comment.aggregatePaginate(aggrigate, options);


    return res
    .status(200)
    .json(
        new ApiResponse(200,{comments} , "Comment Fetched")
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(404 , "not valid Id");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404 , " Video Not Find");
    }
    const { content } = req.body;
    
    if(!content){
        throw new ApiError(401 , "Content Size not be Empty");
    }

    const comment = await Comment.create({
        content,
        video: video._id,
        owner: req.user?._id,
    });
    if(!comment){
        throw new ApiError(500 , "Error while creating Comment");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {comment},
            "Comment is sended"
        )
    )
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(402 , "COMMENTID NOT Valid");
    }
    const {content} = req.body;
    if(!content){
        throw new ApiError(401 , "COMMENT NOT not be Empty");
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content
            }
        },{new:true}
    );
    if(!comment){
        throw new ApiError(404 , "COMMENT NOT FOUNT");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{comment} , "Comment is Updated")
    )
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(402 , "COMMENTID NOT Valid");
    }
    const comment = await Comment.findByIdAndDelete(commentId);
    if(!comment){
        throw new ApiError(404 , "COMMENT NOT FOUNT");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{comment} , "Comment is Deleted")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }