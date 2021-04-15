const { Promise } = require("mongoose");
const { ResetPinSchema } = require("./ResetPin.schema");
const { randomPinPassword } = require("../../src/utils/randomGenerator");

const setPasswordReset = async (email) => {
  // create random pin (6 digits)
  const pinLength = 6;
  const randomPin = await randomPinPassword(pinLength);
  const resetObj = {
    email: email,
    pin: randomPin,
  };
  return new Promise((resolve, reject) => {
    ResetPinSchema(resetObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getPinByEmail = async (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOne({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

const deletePin = async (email, pin) => {
  try {
    ResetPinSchema.findOneAndDelete({ email, pin }, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  setPasswordReset,
  getPinByEmail,
  deletePin,
};
