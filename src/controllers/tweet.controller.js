import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import  { ObjectId } from "mongodb"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content} = req.body

    if (!content || content==="") {
        throw new ApiError(400, "All fields are required")
    }

    const tweet = await Tweet.create({
       content: content,
       owner: req.user._id,
    })

    if(!tweet){
        throw new ApiError(400, "Something went wrong")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet added successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params


    if (!ObjectId.isValid(userId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    let allUserTweets;

    allUserTweets = await Tweet.find({owner:new ObjectId(userId)})
   

    if (!allUserTweets) {
        throw new ApiError(500, "Something went wrong while retriving the tweets")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, allUserTweets, "Tweets retrived successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const {content} = req.body
    
    if (!content) {
            throw new ApiError(400, "All fields are required")
    }

    if (!ObjectId.isValid(tweetId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    const tweets = await Tweet.find({_id:new ObjectId(tweetId),owner:req.user._id})

    if (tweets.length<1) {
        throw new ApiError(500, "Tweet does not exist")
    }

    const updateFields = {
        content
    };

    const tweet = await Tweet.findByIdAndUpdate(
        new ObjectId(tweetId),
        {
            $set: updateFields
        },
        {new: true}
        
    )

    if(!tweet){
        throw new ApiError(400, "Something went wrong while updating the comment!!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    
    const { tweetId } = req.params
 
    if (!ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid ID")
    }
    
    const tweetDetails = await Tweet.find({_id:new ObjectId(tweetId),owner:req.user._id})

    
    if (tweetDetails.length<1) {
        throw new ApiError(500, "Tweet does not exist")
    }

    const result = await Tweet.deleteOne({ _id: new ObjectId(tweetId)})

    if(!result.deletedCount==1){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201)
    .json(
        new ApiResponse(200, {tweetDetails}, "Tweet deleted successfully")
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
