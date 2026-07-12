const express = require("express");
const profileRouter = express.Router()
const authentication = require("../middleware/auth");
profileRouter.get("/profile",authentication,async(req,res)=>{
    const user = req.user;
    console.log(user);
    res.status(200).json(user);
})


module.exports = profileRouter;