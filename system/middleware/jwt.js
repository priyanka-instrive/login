const jwt = require("jsonwebtoken");

const createToken = async (id) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET;
  console.log(TOKEN_SECRET);
  const token = jwt.sign({ id }, TOKEN_SECRET, { expiresIn: "1d" });
  console.log(token);

  return token;
};

const createRefreshToken = async (userId) => {
  const CREATE_REFRESH_TOKEN_SECRET = process.env.CREATE_REFRESH_TOKEN_SECRET;
  const refreshToken = jwt.sign({ id: userId }, CREATE_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};

const verifyRefToken = async (res, refreshToken) => {
  const VERIFY_REFRESH_TOKEN_SECRET = process.env.VERIFY_REFRESH_TOKEN_SECRET;
  let token;
  jwt.verify(refreshToken, VERIFY_REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json("Invalid Token");
    }
    token = createToken(decoded.id);
  });

  return token;
};

module.exports = {
  createToken,
  createRefreshToken,
  verifyRefToken,
};
