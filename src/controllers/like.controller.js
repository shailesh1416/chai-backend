import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import  { ObjectId } from "mongodb"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!ObjectId.isValid(videoId) ) {
        throw new ApiError(400, "Invalid video Id")
    }

    const result = await Like.find({
        likedBy:req.user?._id,
        video:new ObjectId(videoId)
    })


    if(result.length===0){
        const like =await Like.create({
            likedBy:req.user?._id,
            video:new ObjectId(videoId)
        })

        if(!like){
            throw new ApiError(400, "Something went wrong, try again")
        }
        return res.status(201).json(
            new ApiResponse(200, like,"Video Liked")
        )

    }else{
        const like = await Like.deleteOne(
            { _id: result[0]._id},
          )

        if(like.deletedCount!=1){
            throw new ApiError(400, "Something went wrong, try again")
        }
        return res.status(201).json(
            new ApiResponse(200, like,"Video Unliked")
        )

    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if (!ObjectId.isValid(commentId) ) {
        throw new ApiError(400, "Invalid comment Id")
    }

    const result = await Like.find({
        likedBy:req.user?._id,
        video:new ObjectId(commentId)
    })


    if(result.length===0){
        const like =await Like.create({
            likedBy:req.user?._id,
            video:new ObjectId(commentId)
        })

        if(!like){
            throw new ApiError(400, "Something went wrong, try again")
        }
        return res.status(201).json(
            new ApiResponse(200, like,"Comment Liked")
        )

    }else{
        const like = await Like.deleteOne(
            { _id: result[0]._id},
          )

        if(like.deletedCount!=1){
            throw new ApiError(400, "Something went wrong, try again")
        }
        return res.status(201).json(
            new ApiResponse(200, like,"Comment Unliked")
        )

    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if (!ObjectId.isValid(tweetId) ) {
        throw new ApiError(400, "Invalid tweet Id")
    }

    const result = await Like.find({
        likedBy:req.user?._id,
        video:new ObjectId(tweetId)
    })


    if(result.length===0){
        const like =await Like.create({
            likedBy:req.user?._id,
            video:new ObjectId(tweetId)
        })

        if(!like){
            throw new ApiError(400, "Something went wrong, try again")
        }
        return res.status(201).json(
            new ApiResponse(200, like,"Comment liked")
        )

    }else{
        const like = await Like.deleteOne(
            { _id: result[0]._id},
          )

        if(like.deletedCount!=1){
            throw new ApiError(400, "Something went wrong, try again")
        }
        return res.status(201).json(
            new ApiResponse(200, like,"Comment Unliked")
        )

    }

    
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const result = await Like.find({
        likedBy:req.user?._id,
        video: { $exists: true }
    })

    if(!result){
        throw new ApiError(400, "Something went wrong, try again")
    }

    return res.status(201).json(
        new ApiResponse(200, result,"Liked Videos")
    )

    

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}