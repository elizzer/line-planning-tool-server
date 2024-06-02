const {hashPassword}=require("../../utils/hash")
const {validateUsername,validatePassword, validateEmail} = require("./validator")

const userModel=require("../../models/user")


async function signup(req,res){

    try{

        const { username, password, email } = req.body;

        const userNameValidation=validateUsername(username)
        
        if(!userNameValidation.valid){
            throw new Error(userNameValidation.message)
        }

        const emailValidation=validateEmail(email)

        if(!emailValidation.valid){
            throw new Error(emailValidation.message)
        }

        const passwordValidation=validatePassword(password)

        if(!passwordValidation.valid){
            throw new Error(passwordValidation.message)
        }

        const hashedPassword= hashPassword(password)
       
        const newUser=new userModel({
            username:username,
            password:hashedPassword
        })
        
        const savedUser=await newUser.save()
        savedUser._id=undefined
        savedUser.__v=undefined
        return res.json({
            error:false,
            message:"Signup success",
            data:savedUser
        })

    }catch(e){
        if(e.code && e.code==11000){
            return res.json({
                error:true,
                message:"User already exist"
            })
        }
        console.error("[*] Error on signup request ===> ",e.message)
        return res.json({
            error:true,
            message:e.message
        })
    }
   
}

module.exports=signup