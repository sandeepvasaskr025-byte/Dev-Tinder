const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {userValidation} = require("../middleware/userValidator");
const authentication = require("../middleware/auth");
const jwt = require("jsonwebtoken");
authRouter.post("/signup",userValidation,async(req,res)=>{
    const {email,password} =req.body;
    const existUser = await User.findOne({email});
    if(existUser){
        return res.status(409).json("Email already exists")
    }
    const hashPassword = await bcrypt.hash(password,7)
    const user = new User({...req.body,password:hashPassword});
    try{
       const newUser = await user.save();
       const token = jwt.sign({_id:newUser._id},'sandeep@1996',{expiresIn:"1h"})
       res.cookie("token",token)
       res.json({message:"User data saved successfully",data:newUser})
    }
    catch(err){
       res.status(400).send("Error saving the user" + err.message)
    }
})


authRouter.post("/login",async(req,res)=>{
    try {
        const {email, password} = req.body;
    const isValid = await User.findOne({email});
    if(!isValid){
      return res.status(400).json({msg:"User is not registered"})
    }
    const validPass = await bcrypt.compare(password,isValid.password);
    if(validPass){
        const token = jwt.sign({_id:isValid._id},'sandeep@1996',{expiresIn:"1h"})
        res.cookie("token",token)
        res.status(200).json({Message:"Login successful",isValid})
    }  
    else{
        res.status(401).json("Invalid creditionals")
    }
    } catch (err) {
        if(err.message==="TokenExpiredError"){
           return res.status(401).json({ error: "Token has expired" }); 
        }
         res.status(500).json({ error: err.message });
    }
})

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json("Logged out successfully");
});



module.exports = authRouter;