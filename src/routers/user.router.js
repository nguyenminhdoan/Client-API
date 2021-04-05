const express = require("express");
const router = express.Router();
const { insertUser } = require("../../model/user/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const { hashPassword } = require("../../helpers/bcrypt.helper");

router.all("/", (req, res, next) => {
  // res.json({
  //   message: "this message is from user router",
  // });
  next();
});

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
    console.log(result);
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

module.exports = router;
