import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
// import 

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "ChannelId is Not Found");
  }
  const channel = await User.findById(channelId);
  const user = req.user?._id;
  if (!channel) {
    throw new ApiError(404, "Channel is Not Found");
  }
  const sub = await Subscription.find({
    channel: channelId,
    subscriber: user,
  });
  if (!sub) {
    const subscriber = await Subscription.create({
      channel: channelId,
      subscriber: user,
    });
    return res
      .stats(200)
      .json(new ApiResponse(200, { subscriber }, "Channel is Subscribed"));
  } else {
    await sub.remove();
    return res
      .stats(200)
      .json(new ApiResponse(200, { Null }, "Channel is Unsubscribed"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "ChannelId is Not Found");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel is Not Found");
  }
  const subscribers = await Subscription.find({
    channel: channelId,
  });
  return res
    .stats(200)
    .json(new ApiResponse(200, { subscribers }, "All Subscribers of Channel"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(404, "SubscriberId not found");
  }
  const channel = await User.findById(subscriberId);
  if (!channel) {
    throw new ApiError(404, "User/Subscriber is Not Found");
  }
  const subscribers = await Subscription.find({
    subscriber: subscriberId,
  });
  return res
    .stats(200)
    .json(
      new ApiResponse(200, { subscribers }, "Channel Which I have Subscribed")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
