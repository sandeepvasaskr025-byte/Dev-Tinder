const joi = require("joi");
const schema = joi.object({
    firstName:joi.string().alphanum().min(3).max(30).trim(true).required(),
    lastName:joi.string().alphanum().min(1).max(20),
    email:joi.string().email().trim(true).required(),
    password:joi.string().min(8).trim(true).required(),
    age:joi.number().integer().required(),
    gender:joi.string().min(4).max(6).required()
})

const profileUpdate = joi.object({
    firstName:joi.string().alphanum().trim(true).min(3).max(30),
    lastName:joi.string().alphanum().min(1).max(20),
    age:joi.number().integer(),
    gender:joi.string().min(4).max(6)
})

const userValidation = async(req,res,next)=>{
    let {firstName,lastName,email,password,age,gender} = req.body;
    const payload = {firstName,lastName,email,password,age,gender};
    const {error} = schema.validate(payload);
    if(error){
        return res.status(406).json(`Error in User Data : ${error.message}`)
    }
    else{
        next();
    }
}

const updateProfile = async(req,res,next)=>{
        let {firstName,lastName,age,gender} = req.body;
        const payload = {firstName,lastName,age,gender};
        const {error} = profileUpdate.validate(payload);
        if(error){
          return res.status(406).json(`Error in profile update Data : ${error.message}`)   
        }
        else{
            next();
        }
}
module.exports = {userValidation, updateProfile};