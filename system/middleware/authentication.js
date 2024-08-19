const jwt = require("jsonwebtoken");

async function authenticate(req, res, next) {
  const TOKEN_SECRET = process.env.TOKEN_SECRET;
  const token = req.header("Authorization");

  if (!token) {
    return res.status(400).json("Token Not Found");
  }
  const bearerToken = token.split(" ");
  jwt.verify(bearerToken[1], TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json("Invalid Token");
    }
    req.user = decoded.id;
    next();
  });
}

module.exports = {
  authenticate,
};
