const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authentication = async(req,res,next)=>{
    try{
         const {token} = req.cookies;
     if(!token){
        return res.status(500).json("Token not valid")
    } 
    const verifyToken = jwt.verify(token,"sandeep@1996")
    const {_id} = verifyToken;
    const viewUser = await User.findById(_id);
    if(!viewUser){
        return res.status(400).json("User not found")
    }
    req.user = viewUser
    next()

    }
    catch(err){
        res.status(400).json("Error : "+ err.message)
    }
   

}
module.exports = authentication;