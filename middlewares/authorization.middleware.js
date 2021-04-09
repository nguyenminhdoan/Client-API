const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log( authorization);
  // 1) verify if jwt is valid
  const decoded = await verifyAccessJWT(authorization);
  // console.log(decoded);
  if (decoded.email) {
    const userId = await getJWT(authorization);
    // console.log(userId);
    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userId = userId;
    return next();
  }
  // 2) check if is exist in redis
  // 3) extract user id
  // 4) get user profile based on the user id
  return res.status(403).json({ message: "Forbidden" });
};

module.exports = { userAuthorization };
