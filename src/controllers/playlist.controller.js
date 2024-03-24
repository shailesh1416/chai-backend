import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import  { ObjectId } from "mongodb"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if ( [name, description].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required")
    }

    const playlist = await Playlist.create({
        name,
        description, 
        owner: req.user._id,
    })

    const playlistCreated = await Playlist.findById(playlist._id)
    
    if (!playlistCreated) {
        throw new ApiError(500, "Something went wrong while creating playlist")
    }

    return res.status(201).json(
        new ApiResponse(200, playlist, "Playlist created Successfully")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if (!ObjectId.isValid(userId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    let allUserPlaylist;

    allUserPlaylist = await Playlist.find({owner:new ObjectId(userId)})
   

    if (!allUserPlaylist) {
        throw new ApiError(500, "Something went wrong while retriving the Playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, allUserPlaylist, "PLaylist retrived successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!ObjectId.isValid(playlistId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    let playlist = await Playlist.findById(new ObjectId(playlistId))
   

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while retriving the Playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist retrived successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    
    if (!ObjectId.isValid(playlistId) || !ObjectId.isValid(videoId) ) {
        throw new ApiError(400, "Invalid ID")
    }


    const playlist = await Playlist.findByIdAndUpdate(
        new ObjectId(playlistId),
        { $addToSet: { videos: new ObjectId(videoId) } },
        {new: true}
        
    )

    if(!playlist){
        throw new ApiError(400, "Something went wrong while updating the playlist!!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"))


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

     
    if (!ObjectId.isValid(playlistId) || !ObjectId.isValid(videoId) ) {
        throw new ApiError(400, "Invalid ID")
    }


    const playlist = await Playlist.findByIdAndUpdate(
        new ObjectId(playlistId),
        { $pull: { videos: new ObjectId(videoId) } },
        {new: true}
        
    )

    if(!playlist){
        throw new ApiError(400, "Something went wrong while updating the playlist!!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"))



})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
 
    if (!ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid ID")
    }
    
    const playlistDetails = await Playlist.find({_id:new ObjectId(playlistId),owner:req.user._id})

    
    if (playlistDetails.length<1) {
        throw new ApiError(500, "Playlist does not exist")
    }

    const result = await Playlist.deleteOne({ _id: new ObjectId(playlistId)})

    if(!result.deletedCount==1){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201)
    .json(
        new ApiResponse(200, {playlistDetails}, "Playlist deleted successfully")
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
     if (!name || !description) {
            throw new ApiError(400, "All fields are required")
    }

    if (!ObjectId.isValid(playlistId) ) {
        throw new ApiError(400, "Invalid ID")
    }

    const playlists = await Playlist.find({_id:new ObjectId(playlistId),owner:req.user._id})

    if (playlists.length<1) {
        throw new ApiError(500, "Playlist does not exist")
    }

    const updateFields = {
        name,
        description
    };

    const playlist = await Playlist.findByIdAndUpdate(
        new ObjectId(playlistId),
        {
            $set: updateFields
        },
        {new: true}
        
    )

    if(!playlist){
        throw new ApiError(400, "Something went wrong while updating the playlist!!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"))

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
