const joi = require("joi");
const schema = joi.object({
    firstName:joi.string().alphanum().min(3).max(30).trim(true).required(),
    lastName:joi.string().alphanum().min(1).max(20),
    email:joi.string().email().trim(true).required(),
    password:joi.string().min(8).trim(true).required(),
    age:joi.number().integer().required(),
    gender:joi.string().min(4).max(6).required()
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
module.exports = userValidation;