const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        enum:{
          values:["male","female","others"],
          message : `{values} is not a valid gender type`
        }
    }
},{timestamps:true})
module.exports = mongoose.model("User",userSchema);