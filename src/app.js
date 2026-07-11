const express = require("express");
const app = express();
const connectDB = require("./config/database")
const User = require("./models/user");
const userValidation = require("./middleware/userValidator");
const bcrypt = require("bcryptjs")
app.use(express.json());
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
        return res.status(400).json("User already Signedup")
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
app.get("/feed",async(req,res)=>{
    const userData = await User.find();
    res.send(userData);
}) 
app.put("/update",async(req,res)=>{
    try{
    const { id, ...data } = req.body;
    const modifyData = await User.findByIdAndUpdate(id,data,{new:true});
    res.json(modifyData);
    }
    catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
})
app.delete("/delete",async(req,res)=>{
    let {_id} = req.body;
    const removeUser = await User.findByIdAndDelete({_id});
    res.json("Data removed successfully");
})
