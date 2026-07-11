const express = require("express");
const app = express();
const connectDB = require("./config/database")
const User = require("./models/user");
const userValidation = require("./middleware/userValidator");
const authentication = require("./middleware/auth");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
connectDB().then(()=>{
   console.log("Database connection Established")
   app.listen(7777,()=>{
    console.log("Server is running on port:7777")
})
})
.catch(()=>{
  console.error("Database cannot be connected");
})
app.post("/signup",userValidation,async(req,res)=>{
    const {email,password} =req.body;
    const existUser = await User.findOne({email});
    if(existUser){
        return res.status(409).json("Email already exists")
    }
    const hashPassword = await bcrypt.hash(password,7)
    const user = new User({...req.body,password:hashPassword});
    try{
       await user.save();
       res.send("User data saved successfully")
    }
    catch(err){
       res.status(400).send("Error saving the user" + err.message)
    }
})
app.post("/login",async(req,res)=>{
    const {email, password} = req.body;
    const isValid = await User.findOne({email});
    if(!isValid){
      return res.status(400).json("User is not registered")
    }
    const validPass = await bcrypt.compare(password,isValid.password);
    if(validPass){
        const token = jwt.sign({_id:isValid._id},'sandeep@1996',{expiresIn:"1h"})
        res.cookie("token",token)
        res.status(200).json("Login successful")
    }  
    else{
        res.status(401).json("Invalid creditionals")
    }
})
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json("Logged out successfully");
});
app.get("/profile",authentication,async(req,res)=>{
    const user = req.user;
    console.log(user);
    res.status(200).json(user);

})
app.post("/sendConnectionRequest",authentication,async(req,res)=>{
    const user = req.user;
    res.json(user.firstName+" "+"sent the connection request")
})

