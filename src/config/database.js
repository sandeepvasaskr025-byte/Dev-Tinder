const mongoose = require("mongoose");
const connectDB = async()=>{
    try{
         await mongoose.connect("mongodb+srv://sandeepranisk25_db_user:tsGnyLVE0BoSfmre@cluster0.msjfl1k.mongodb.net/devtinder1?retryWrites=true&w=majority"
        
    )
    console.log("Database connected")
    }
    catch(err){
        console.error("mongodb connection error",err.message)
    }
   
}

module.exports = connectDB;