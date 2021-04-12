const express = require("express");
const router = express.Router();
const {
  verifyRefreshJWT,
  createAccessJWT,
} = require("../../helpers/jwt.helper");
const { getUserByEmail } = require("../../model/user/User.model");
router.get("/", async (req, res, next) => {
  const { authorization } = req.headers;

  //1) check valid token
  const decoded = await verifyRefreshJWT(authorization);
  //   console.log(decoded);
  if (!decoded.email)
    return res.status(403).json({
      message: "forbidden",
    });

  const userProfile = await getUserByEmail(decoded.email);
  const dbRefreshToken = userProfile.refreshJWT.token;
  if (userProfile._id) {
    let tokenExp = userProfile.refreshJWT.addedAt;
    // console.log(`token created in: ${tokenExp} `);
    // add more 30days to refresh tokens
    tokenExp = tokenExp.setDate(
      tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
    );
    const today = new Date();
    if (dbRefreshToken !== authorization && today > tokenExp) {
      return res.status(403).json({
        message: "forbidden",
      });
    }
    const accessJWT = await createAccessJWT(
      decoded.email,
      userProfile._id.toString()
    );
    return res.json({ status: "success", accessJWT });
  }

  // 2) check if jwt is  exist in database
});

module.exports = router;
