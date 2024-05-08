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
    if(!user){
        throw new Error("Incorrect creds")
    }
    //verify password hash
    if(!verifyPassword(password,user.password) ){
        throw new Error("Incorrect creds!!")
    }
    
    //sign jwt token
    const token= await signToken(user._id)
    return res.json({
        error:false,
        message:"Login success",
        data:{
            username:user.username,
            token:token
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