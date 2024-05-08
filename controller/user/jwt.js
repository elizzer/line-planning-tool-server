const jwt = require("jsonwebtoken");

function signToken(userId) {
  const token =  jwt.sign({ data: userId, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.JWT_SECRET_KEY);
  return token;
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
