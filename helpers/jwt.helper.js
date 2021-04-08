var jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redis.helper");
const { storeUserRefreshJWT } = require("../model/user/User.model");

const createAccessJWT = async function (email, _id) {
  try {
    const accessJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    // console.log(accessJWT);

    await setJWT(accessJWT, _id);
    return Promise.resolve(accessJWT);
  } catch (error) {}
};

const createRefreshJWT = async function (email, _id) {
  try {
    const refreshJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30d",
    });

    const result = await storeUserRefreshJWT(_id, refreshJWT);

    return Promise.resolve(refreshJWT);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createAccessJWT,
  createRefreshJWT,
};
