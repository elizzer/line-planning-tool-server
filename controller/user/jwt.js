const jwt = require("jsonwebtoken");

function signToken(userId) {
  const expTime=Math.floor(Date.now() / 1000) + (60 * 60)
  const token =  jwt.sign({ data: userId, exp: expTime }, process.env.JWT_SECRET_KEY);
  return {token,expTime};
}

async function verifyToken(token) {
    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded
      } catch(err) {
        return false
      }
}

module.exports = { signToken,verifyToken };
