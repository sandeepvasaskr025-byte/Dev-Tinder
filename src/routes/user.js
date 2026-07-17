const express = require("express");
const userRouter = express.Router();
const authentication = require('../middleware/auth');
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
//Get all the pending connection request
userRouter.get("/user/requests/received",authentication,async(req,res)=>{
    try {
        const loggedInUser = req.user; 
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,status:"interested"
        }).populate("fromUserId",["firstName","lastName","-_id"]);
        res.status(400).json({Message:"Featched data successfully",connectionRequest})

    } catch (error) {
        res.status(400).json("Error:",error.message);
    }
   
})

userRouter.get("/user/connection",authentication,async(req,res)=>{
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
        $or:[{toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"},
        ]
    }).populate("fromUserId","firstName lastName")
    .populate("toUserId","firstName lastName")
    const data = connectionRequest.map((row)=>{
        if(row.fromUserId._id?.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    })
    res.status(200).json({data})
})

userRouter.get("/user/feed",authentication,async(req,res)=>{
    // User shoule see the all user cards except
    // 1.his own card
    // 2.His connections
    // 3.ignored people
    // 4. already sent the connection request 
    try {
        const loggedInUser = req.user; 
        const page = req.query.page || 1; 
        let limit = req.query.limit || 10;
        limit > 20 ? 20 : limit
        const skip = (page-1)*10;
        const connectionRequest = await ConnectionRequest.find({
            $or:[{ fromUserId:loggedInUser._id},
             {toUserId:loggedInUser._id}] })
    .select("fromUserId toUserId");
    const hideUsers = new Set();
    connectionRequest.forEach((req)=>{
        hideUsers.add(req.fromUserId.toString()),
        hideUsers.add(req.toUserId.toString())
    })
    console.log(hideUsers);
    const users = await User.find({
        _id:{$nin:Array.from(hideUsers)}
    }).skip(skip).limit(limit);
    res.status(200).json({message:"Featched all card",data:users});   
    } catch (error) {
        res.status(400).json("Error",error.message)
    }
})
module.exports = userRouter;