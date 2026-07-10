const express = require("express");
const app = express();
const connectDB = require("./config/database")
const User = require("./models/user")

connectDB().then(()=>{
   console.log("Database connection Established")
   app.listen(7777,()=>{
    console.log("Server is running on port:7777")
})
})
.catch(()=>{
  console.error("Database cannot be connected");
})
app.post("/user",async(req,res)=>{
    const user = new User({
        firstName:"Sandeep",
        lastName:"Kumar",
        email:"sandeep@gmail.com",
        password:"vasanth@25",
        age:30,
        gender:"Male",
    })
    await user.save();
    res.send("User data saved successfully")
})
app.get("/userData",async(req,res)=>{
    const userData = await User.find();
    res.send(userData);
})
