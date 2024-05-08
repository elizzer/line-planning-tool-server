const { verifyToken } = require("../user/jwt");
const userModel = require("../../models/lines")

async function isLoggedIn(req, res, next) {
  try {

    if(!req.headers.authorization){
        throw new Error("user not logged in")
    }

    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        throw new Error("user not logged in")
    }
    const tokenData = await verifyToken(token);
    console.log(tokenData)

    if(!tokenData){
        throw new Error("User not logged in")
    }

    const _user=userModel.findById(tokenData.data)
    if(!_user){
        throw new Error("Undefined User")
    }

    req.userId = tokenData.data;
    
    next()

  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = isLoggedIn;
