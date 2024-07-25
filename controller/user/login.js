const {verifyPassword}= require("../../utils/hash")
const {signToken}= require("./jwt")
const userModel=require("../../models/user")

async function login(req, res) {
  try {
    const { username, password } = req.body;
    // console.log(req.body)
    if (!username || !password) {
      throw new Error("All fields required");
    }
    //find the user
    const user=await  userModel.findOne({username:username})
    console.log(user)
    const id_user= await userModel.findById(user._id.toString())
    console.log("[+]user id find ",id_user)
    if(!user){
        throw new Error("Incorrect creds")
    }
    //verify password hash
    if(!verifyPassword(password,user.password) ){
        throw new Error("Incorrect creds!!")
    }
    
    //sign jwt token
    const {token,expTime}= await signToken(user._id)
    return res.json({
        error:false,
        message:"Login successsss",
        data:{
            username:user.username,
            token:token,
            expTime
        }
    })

  } catch (e) {
    return res.json({
      error: true,
      message: e.message,
    });
  }
}

module.exports=login