import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    console.log(name);
    console.log(description);
    
    
    if(!(name) || !(description)) {
        throw new ApiError(401 , "Title And Description Required");
    }
    
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    });
    if(!playlist){
        throw new ApiError(401 , "Not able to create Playlist");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , {playlist} , "Playlist is Created")
    );

    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    //TODO: add piplines fron video details 
    if(!isValidObjectId(userId)){
        throw new ApiError(404 , "Not Valid User Id");
    }
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404 , "User Not Found");
    }
    const playlist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }   
        },
        {
            $addFields: {
                totalVideos: {
                    $size : "$videos"
                },
                totalViews: {
                    $sum : "$videos.views"
                }
            }
        },
        {
            $project: {
                _id : 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1
            }
        }
    ]);

    
    // const playlist = await Playlist.find({owner: user?._id});
    if(!playlist){
        return res
        .status(200)
        .json(
            new ApiResponse(200 , {} , "Playlist is Empty or Not Found")
        )
    }
    console.log("Playlist data : " , playlist);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200 , { playlist } , "Playlist are Fetched")
    )
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    //TODO: add piplines fron video details
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Not Valid Playlist Id ");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
                totalViews: { $sum: "$videos.views" }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: 1,
            }
        }
    ])
    // const playlist = await Playlist.findById(playlistId);
    if(!playlist){              
        throw new ApiError(404, "Playlist Not Found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, {playlist} , "Playlist Fetchedd Successfully!!")
    )
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(404, "VideoId or PlaylistId is Invalid");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video Not Found");
    }
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{
                videos: videoId
            }
        },{ new: true }
    )
    if(!playlist){
        throw new ApiError(404, "Playlist Not Found");
    }
    
    // to push video in videos array in model
    // await playlist.videos.push(videoId);
    // playlist.save();
    return res.status(200)
    .json(
        new ApiResponse(200, {playlist}, "Video Is AddedTo Playlist")
    )
    
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(404, "VideoId or PlaylistId is Invalid");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video Not Found");
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist Not Found");
    }
    
    // to push video in videos array in model
    let index = await playlist.videos.indexOf(videoId);
    if (index !== -1) {
        await playlist.videos.splice(index, 1);
    }

    playlist.save();

    return res.status(200)
    .json(
        new ApiResponse(200, {playlist}, "Video Is Removed from Playlist")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, " PlaylistId is Invalid");
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if(!playlist){
        throw new ApiError(404 , "Playlist is Not found");
    }
    return res.status(200)
    .json(
        new ApiResponse(200, {playlist}, "Playlist Deleted")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, " PlaylistId is Invalid");
    }
    if(!(name && description))
        throw new ApiError(401, "Name and Description cannot be empty");
    
    if(name && description){
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set:{
                    name,
                    description
                }
            },{new: true}
        );
        if(!playlist){
            throw new ApiError(404 , "Playlist is Not found");
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200, {playlist}, "Playlist Updated")
        )
    }else {
        if(!name){
            const playlist = await Playlist.findByIdAndUpdate(
                playlistId,
                {
                    $set:{
                        description
                    }
                },{new: true}
            );
            if(!playlist){
                throw new ApiError(404 , "Playlist is Not found");
            }
            return res
            .status(200)
            .json(
                new ApiResponse(200, {playlist}, "Playlist Updated")
            )
        }
        if(!description){
            const playlist = await Playlist.findByIdAndUpdate(
                playlistId,
                {
                    $set:{
                        description
                    }
                },{new: true}
            );
            if(!playlist){
                throw new ApiError(404 , "Playlist is Not found");
            }
            return res
            .status(200)
            .json(
                new ApiResponse(200, {playlist}, "Playlist Updated")
            )
        }
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Playlist Updated")
    )

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}