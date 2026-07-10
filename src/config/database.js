const mongoose = require("mongoose");
const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://sandeepranisk25_db_user:GSkimidcXwsOCZUH@cluster0.msjfl1k.mongodb.net/devtinder")
}

module.exports = connectDB;