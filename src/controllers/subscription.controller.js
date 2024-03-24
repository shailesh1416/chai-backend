import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import  { ObjectId } from "mongodb"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
   
    // console.log("test",channelId)

    if (!ObjectId.isValid(channelId) ) {
        throw new ApiError(400, "Invalid video ID")
    }

    const result = await Subscription.find({
        subscriber:req.user?._id,
        channel:new ObjectId(channelId)
    })

    let msg=""

    if(result.length===0){
        const subscription =await Subscription.create({
            subscriber:req.user?._id,
            channel:new ObjectId(channelId)
        })

        if(!subscription){
            throw new ApiError(400, "Something went wrong, try again")
        }
        msg = "Channel Subscribed"

    }else{
        console.log(result[0]._id)
        const subscription = await Subscription.deleteOne(
            { _id: result[0]._id},
          )

        if(subscription.deletedCount!=1){
            throw new ApiError(400, "Something went wrong, try again")
        }
        msg = "Channel UnSubscribed"

    }


    return res.status(201).json(
        new ApiResponse(200, {},msg)
    )

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO:     
    if (!ObjectId.isValid(channelId) ) {
        throw new ApiError(400, "Invalid ID")
    }
    const result = await Subscription.find({
        channel:new ObjectId(channelId)
    })

    if(result.length<0){
        return res.status(201).json(
            new ApiResponse(200, {},"No subscribers yet")
        )
    }
    return res.status(201).json(
        new ApiResponse(200, result,`You have ${result.length} subscribers`)
    )

    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!ObjectId.isValid(subscriberId) ) {
        throw new ApiError(400, "Invalid ID")
    }
    
    const result = await Subscription.find({
        subscriber:new ObjectId(subscriberId)
    })

    if(result.length<0){
        return res.status(201).json(
            new ApiResponse(200, {},"No subscription yet")
        )
    }
    return res.status(201).json(
        new ApiResponse(200, result,`You have subscribed ${result.length} channels`)
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}