const express = require("express");
const app = express();
const connectDB = require("./config/database")
const authRouter = require("./routes/auth");
const cookieParser = require('cookie-parser');
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

app.use(express.json());
app.use(cookieParser());
app.use("/api",authRouter);
app.use("/api",profileRouter);
app.use("/api",requestRouter);
connectDB().then(()=>{
   console.log("Database connection Established")
   app.listen(7777,()=>{
    console.log("Server is running on port:7777")
})
})
.catch(()=>{
  console.error("Database cannot be connected");
})




