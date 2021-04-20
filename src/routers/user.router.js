const express = require("express");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updateNewPassword,
  storeUserRefreshJWT,
} = require("../../model/user/User.model");
const {
  createAccessJWT,
  createRefreshJWT,
} = require("../../helpers/jwt.helper");
const {
  userAuthorization,
} = require("../../middlewares/authorization.middleware");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const {
  hashPassword,
  comparePassword,
} = require("../../helpers/bcrypt.helper");
const { json } = require("body-parser");
const {
  setPasswordReset,
  getPinByEmail,
  deletePin,
} = require("../../model/reset_pin/ResetPin.model");

const { emailProcessor } = require("../../helpers/email.helper");
const {
  resetPasswordReqValid,
  updatePasswordReqValid,
} = require("../../middlewares/formValidation.middleware");

const { deleteJWT } = require("../../helpers/redis.helper");

// ######################## END IMPORT MODULE ################################33
router.all("/", (req, res, next) => {
  // res.json({
  //   message: "this message is from user router",
  // });
  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;
  const userProfile = await getUserById(_id);

  res.json({ user: userProfile });
});
// Create new user route
router.post("/", async (req, res, next) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    // HASH PASSWORD
    const hashedPassword = await hashPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPassword,
    };
    const result = await insertUser(newUserObj);
    res.json({
      message: "New user created",
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

// User SIGN IN route
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  // console.log(email, password);

  if (!email || !password)
    return res.json({
      status: "failed",
      message: "Invalid form submit",
    });

  // GET USER WITH EMAIL FROM DB
  const user = await getUserByEmail(email);
  // console.log(user);
  const passFromDb = user && user._id ? user.password : null;
  // console.log(passFromDb);
  if (!passFromDb)
    return res.json({
      status: "error",
      message: "Invalid email or password",
    });
  const result = await comparePassword(password, passFromDb);

  // console.log(result);
  if (!result)
    return res.json({
      status: "failed",
      message: "Invalid email or password",
    });

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Login Successfully",
    accessJWT,
    refreshJWT,
  });
});

// User  RESET PASSWORD
router.post("/reset-password", resetPasswordReqValid, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (user && user._id) {
    const setPin = await setPasswordReset(email);
    const result = await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password",
    });

    result && result.messageId;
    return res.json({
      status: "success",
      message:
        "We have sent the reset pin by email, please check your email!!!",
    });
  }
  return res.json({
    status: "error",
    message: "We have sent the reset pin by email, please check your email!!!",
  });
});

router.patch("/reset-password", updatePasswordReqValid, async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getPin = await getPinByEmail(email, pin);

  if (getPin._id) {
    const databaseDate = getPin.addedAt;
    const expiredIn = 1;
    let expiredDate = databaseDate.setDate(databaseDate.getDate() + expiredIn);
    const today = new Date();
    if (today > expiredDate) {
      return res.json({
        status: "error",
        message: "Invalid Pin or Expired Pin !!!",
      });
    }
    const hashedNewPassword = await hashPassword(newPassword);
    const user = await updateNewPassword(email, hashedNewPassword);

    if (user._id) {
      await emailProcessor({ email, type: "password-update-success" });
      deletePin(email, pin);
      return res.json({
        status: "success",
        message: "Your password has been updated successfully",
      });
    }
  }
});

router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;
  // this data coming from db
  const _id = req.userId;
  // delete accessJWT from redis db
  deleteJWT(authorization);

  //delete refresh token from mongodb
  const result = await storeUserRefreshJWT(_id, "");

  if (result._id) {
    return res.json({ status: "success", message: "Logged out successfully" });
  }

  res.json({ status: "error", message: "cannot log out, please try later" });
});
module.exports = router;
