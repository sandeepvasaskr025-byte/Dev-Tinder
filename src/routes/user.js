const express = require("express");
const userRouter = express.Router();
const authentication = require('../middleware/auth');
const ConnectionRequest = require("../models/connectionRequest");
const { replaceOne } = require("../models/user");
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

module.exports = userRouter;