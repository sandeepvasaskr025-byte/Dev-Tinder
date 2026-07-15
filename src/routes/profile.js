const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user")
const authentication = require("../middleware/auth");
const { updateProfile } = require("../middleware/userValidator");
profileRouter.get("/profile",authentication,async(req,res)=>{
    const user = req.user;
    console.log(user);
    res.status(200).json(user);
})
profileRouter.put("/profile/edit",authentication,updateProfile,async(req,res)=>{
   try
   {
     const {_id} = req.user;
    const updates = {...req.body}
  if (updates.email) {
    return res.status(400).json("Invalid edit request: email cannot be changed here");
  }
    if (updates.password) {
    return res.status(400).json("Invalid edit request: password cannot be changed here");
  }
   
    const updateProfile = await User.findByIdAndUpdate(_id,{$set:updates},{new:true});
     if (!updateProfile) {
      return res.status(404).json("User not found");
    }
    res.json(updateProfile);
   }
   catch(err){
    res.status(400).json("Error updating profile: " + err.message); 
   }
})


module.exports = profileRouter;