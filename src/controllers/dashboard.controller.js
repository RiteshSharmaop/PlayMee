import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError(404, "channelId Not Found");
    }
    const use = await User.findById(channelId);
    if(!use){
        throw new ApiError(404, "User Not Found");
    }
    
    const videos = await Video.aggregate([
        {
            $match: {
                owner : new mongoose.Types.ObjectId(channelId)
            } 
        },
        {
            $group:{
                _id : new mongoose.Types.ObjectId(channelId),
                views: {
                    $sum: "$views"
                },
                totalVideos:{
                    $sum: 1
                }

            }
        }
    ]);

    let totVideos = 0;
    let views = 0;
    
    if(videos.length > 0) {
        totVideos = videos[0].totalVideos
        views = videos[0].views
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: new mongoose.Types.ObjectId(channelId),
                totalSubscriber: {
                    $sum : 1
                }
            }
        }
    ]);
    let totSubscribers = 0;
    if(subscribers.length > 0){
        totSubscribers = subscribers[0].totalSubscriber
    }

    
    const dashboard = {
        totalVideos : totVideos,
        totalViews : views,
        totalSubscribers : totSubscribers
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {dashboard} , "Dashboard Fetched")
    )

});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
});

export {
    getChannelStats, 
    getChannelVideos
    }