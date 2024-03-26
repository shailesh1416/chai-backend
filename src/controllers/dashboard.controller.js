import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    // video count
    const videos = await Video.find({owner:req.user._id})
   
    const videoCount = videos.length

    const aggregateResult = await Video.aggregate([
        { $match: { owner: req.user._id } }, // Filter documents by owner
        { $group: { _id: null, totalViews: { $sum: "$views" } } } // Group and calculate sum of views
    ]);

    const totalSubscriptions = (await Subscription.find({channel:req.user._id})).length

    const likesCount = await Like.aggregate([
        {
            $lookup: {
                from: "videos", // Name of the video collection
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $match: {
                "videoDetails.owner": req.user._id
            }
        }
        ,{
            $count: "totalLikes"
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, 
        {
        "videoCount":videoCount,
        "viewCount":aggregateResult[0].totalViews,
        "totalSubscriptions":totalSubscriptions,
        "totalLikes": likesCount[0].totalLikes
    }, 
    "Stats for channel retrived successfully"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    
    const videosWithLikesAndOwnerDetails = await Video.aggregate([
        {
            $match: {
                owner: req.user._id
            }
        },
        {
            $lookup: {
                from: "likes", // Name of the likes collection
                localField: "_id",
                foreignField: "video",
                as: "likesCount"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $cond: { 
                        if: { $isArray: "$likesCount" }, // Check if likesCount is an array
                        then: { $size: "$likesCount" }, // Calculate the size of the likesCount array
                        else: 0 // Set likesCount to 0 if it's not an array
                    }
                }
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, 
        {"videos":videosWithLikes,
    }, 
    "Videos retrived successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }