import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js"
import { deleteFileFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {isValidObjectId} from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
})

const publishAVideo = asyncHandler(async (req , res)=> {
    const {title , description ,status} = req.body;
    
    if(!title && ! description){
        throw new ApiError(400 , "Title Description Required");
    }
    const flag = false;
    if(status === "true"){
        flag = true;
    }
    console.log("Title : " , title);
    console.log("Description : " , description);

    const localVideoPath = req.files?.videoFile[0]?.path;
    if(!localVideoPath){
        throw new ApiError(400 , "Video Required");
    }
    const localThumbnailPath = req.files?.thumbnail[0]?.path;
    if(!localThumbnailPath){
        throw new ApiError(400 , "Thumbnail Required");
    }

    const cloudVideoLink = await uploadOnCloudinary(localVideoPath);
    const cloudThumbLink = await uploadOnCloudinary(localThumbnailPath);
    if(!(cloudThumbLink && cloudVideoLink)){
        throw new ApiError(500, "VIDEO AND THUMBNAIL NOt able to upload successfully");
    }
    
    const video = await Video.create({
        title,
        description,
        videoFile: cloudVideoLink?.url,
        thumbnail: cloudThumbLink?.url,
        duration: cloudVideoLink?.duration || 0,
        views: 0,
        isPublished: flag,
        owner: req.user?._id

    })
    return res.status(200).json(new ApiResponse(200 , {video} , "Video Uploaded"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "this video is not valid");
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            // increasing views EveryTime
            $inc:{
                views: 1
            }
        },{new : true}
    );
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    
    return res.status(200)
    .json(
        new ApiResponse(200, {video} , "Vide is Featched")
    )

});
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "this video is not valid");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    const {title, description} = req.body;
    video.title = title || video.title;
    video.description = description || video.description;
    
    const localFilePath = req.file?.path
    if(!localFilePath){
        video.save();
        return res
        .status(200)
        .json(
            new ApiResponse(200,{video} , "Details Updates Successfully")
        );
    }
    const thumbnail = await uploadOnCloudinary(localFilePath);
    if(!thumbnail){
        throw new ApiError(500, "Error While Uploading To Cloudinary");
    }
    // todo: delete from cloudinary not working
    if(thumbnail?.url){
        await deleteFileFromCloudinary(video.thumbnail);
    }
    video.thumbnail =  thumbnail?.url || video.thumbnail;
    video.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200,{video} , "Details Updates Successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)) {
        throw new ApiError(404, "this video is not valid");
    }
    const video = await Video.findByIdAndDelete(videoId);
    if(!video){
        throw new ApiError(404, "Video Not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{} , "Video Deleted Successfully")
    )
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "this video is not valid");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    console.log(video.isPublished);
    
    if(video.isPublished === false){
        video.isPublished = true;
        video.save();
    }else {
        video.isPublished = false;
        video.save();
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {video} , "Updated"));
})



export {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}