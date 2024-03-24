import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import  { ObjectId } from "mongodb"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query


    if (!ObjectId.isValid(videoId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    let allVideoComments;

    allVideoComments = await Comment.find({video:new ObjectId(videoId)})
   
    console.log(allVideoComments)

    if (!allVideoComments) {
        throw new ApiError(500, "Something went wrong while retriving the video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, allVideoComments, "Comment retrived successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content} = req.body

    if (!ObjectId.isValid(videoId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    if (!content || content==="") {
        throw new ApiError(400, "All fields are required")
    }

    const comment = await Comment.create({
       content: content,
       video: new ObjectId(videoId),
       owner: req.user._id,
    })

    if(!comment){
        throw new ApiError(400, "Something went wrong")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const {content} = req.body
    
    if (!content) {
            throw new ApiError(400, "All fields are required")
    }

    if (!ObjectId.isValid(commentId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    const comments = await Comment.find({_id:new ObjectId(commentId),owner:req.user._id})

    if (comments.length<1) {
        throw new ApiError(500, "Comment does not exist")
    }

    const updateFields = {
        content
    };

    const comment = await Comment.findByIdAndUpdate(
        new ObjectId(commentId),
        {
            $set: updateFields
        },
        {new: true}
        
    )

    if(!comment){
        throw new ApiError(400, "Something went wrong while updating the comment!!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"))



  

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params
 
    if (!ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid Comment ID")
    }
    
    const commentDetails = await Comment.find({_id:new ObjectId(commentId),owner:req.user._id})

    
    if (commentDetails.length<1) {
        throw new ApiError(500, "Comment does not exist")
    }

    const result = await Comment.deleteOne({ _id: new ObjectId(commentId)})

    if(!result.deletedCount==1){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201)
    .json(
        new ApiResponse(200, {commentDetails}, "Comment deleted successfully")
    )

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
