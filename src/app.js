const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/database")
const authRouter = require("./routes/auth");
const cookieParser = require('cookie-parser');
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
connectDB().then(()=>{
   console.log("Database connection Established")
   app.listen(7777,"0.0.0.0",()=>{
    console.log("Server is running on port:7777")
})
})
.catch(()=>{
  console.error("Database cannot be connected");
})




