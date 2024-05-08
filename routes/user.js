const express = require("express")
const router = express.Router()

const signupController=require("../controller/user/signup")
const loginController =require("../controller/user/login")


router.get("/",(req,res)=>{

})

router.post("/auth/signup",signupController)
router.post("/auth/login",loginController)

module.exports=router