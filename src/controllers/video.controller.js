import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import  { ObjectId } from "mongodb"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // query is yet to be implemented
  
    const sortby = sortBy?sortBy:"title"
    const sorttype = sortType?parseInt(sortType):1

    let allVideos;
    // if (userId){
    //     allVideos = await Video.find()
    // }else{
        allVideos = await Video.find(userId?{_id:userId}:{}).skip(0).limit(limit).sort({[sortby]:sorttype})
    // }
    if (!allVideos) {
        throw new ApiError(500, "Something went wrong while retriving the video")
    }

    return res.status(201).json(
        new ApiResponse(200, allVideos, "All Video retrived successfully")
    )

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    
    if (
        [title, description].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }

        const videoLocalPath = req.files?.videoFile[0]?.path;
        //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
        let thumbnailLocalPath;
        if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
            thumbnailLocalPath = req.files.thumbnail[0].path
        }

        if (!videoLocalPath) {
            throw new ApiError(400, "VideoFile is required")
        }

        const videoFile = await uploadOnCloudinary(videoLocalPath)
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (!videoFile) {
            throw new ApiError(400, "videoFile is required")
        }

        // console.log(videoFile)

        const video = await Video.create({
            title,
            videoFile: videoFile.url,
            thumbnail: thumbnail?.url || "",
            description, 
            duration: videoFile.duration
        })

        const createdVideo = await Video.findById(video._id).select(
            "-description"
        )
        
        if (!createdVideo) {
            throw new ApiError(500, "Something went wrong while publishing video")
        }
    
        return res.status(201).json(
            new ApiResponse(200, createdVideo, "Video published Successfully")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId?.trim()) {
        throw new ApiError(400, "Video does not exist")
    }

    const validId = ObjectId.isValid(videoId) 

    if (!validId) {
        throw new ApiError(400, "Invalid video ID")
    }
    
    const videoDetails = await Video.findById(new ObjectId(videoId))


    if (!videoDetails) {
        throw new ApiError(500, "Something went wrong while retriving the video")
    }

    return res.status(201).json(
        new ApiResponse(200, videoDetails, "Video retrived successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
