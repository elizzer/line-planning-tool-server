const bcrypt = require("bcrypt");

// Get the secret key from environment variable
const secretKey = process.env.SECRET_KEY;

function hashPassword(password) {
  const hashedPassword = bcrypt.hashSync(password, 5);
  return hashedPassword;
}

function verifyPassword(password, hashedPassword) {
  const passwordMatch = bcrypt.compareSync(password, hashedPassword);
  return passwordMatch;
}

module.exports = { hashPassword, verifyPassword };
