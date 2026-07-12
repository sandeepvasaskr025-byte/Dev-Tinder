const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const authentication = require("../middleware/auth");

requestRouter.get("/profile",authentication,async(req,res)=>{
    const user = req.user;
    console.log(user);
    res.status(200).json(user);

})
requestRouter.post("/sendConnectionRequest",authentication,async(req,res)=>{
    const user = req.user;
    res.json(user.firstName+" "+"sent the connection request")
})


module.exports = requestRouter;