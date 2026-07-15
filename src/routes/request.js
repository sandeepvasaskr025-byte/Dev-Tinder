const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const authentication = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
requestRouter.get("/profile",authentication,async(req,res)=>{
    const user = req.user;
    console.log(user);
    res.status(200).json(user);

})
requestRouter.post("/request/send/:status/:toUserId",authentication,async(req,res)=>{
   try {
     const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["interested","ignored"];
    if(!allowedStatus.includes(status)){
        res.status(400).json({message:"Invalid status type:",status});
    }
    const toUser = await User.findById(toUserId);
    if(!toUser){
        return res.status(404).json({message:"User not found"})
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
        fromUserId,toUserId,
    })
    if(existingConnectionRequest){
        return res.status(409).json("This User already sent request");
    }
    const reverseRequest = await ConnectionRequest.findOne({
        fromUserId:toUserId,toUserId:fromUserId
    })
    if(reverseRequest){
        return res.status(409).json("This User already sent request");
    }
    const connectionRequest = new ConnectionRequest({
        fromUserId,toUserId,status
    })
    const data = await connectionRequest.save();

    res.json({Msg:`${req.user.firstName} is ${status} ${toUser.firstName}` ,
            data})
    
   } catch (error) {
     res.status(500).json({message:error.message})
   }
})

requestRouter.post("/request/review/:status/:requestId",authentication,async(req,res)=>{
    const {status,requestId} = req.params;
    const loggedInUser = req.user;
    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
       return res.status(400).json({msg:"Invalid status type"});
    }
    const connection = await ConnectionRequest.findOne({_id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",
    })
    if(!connection){
        return res.status(404).json({msg:"connection request not found"})
    }
    connection.status = status;
    const data = await connection.save();
    res.status(200).json({message:"Connection request" + status, data});

})


module.exports = requestRouter;