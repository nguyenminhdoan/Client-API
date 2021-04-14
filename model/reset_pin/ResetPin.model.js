const { Promise } = require("mongoose");
const { ResetPinSchema } = require("./ResetPin.schema");
const { randomPinPassword } = require("../../src/utils/randomGenerator");

const setPasswordReset = async (email) => {
  // create random pin (6 digits)
  const pinLength = 6;
  const randomPin =  await randomPinPassword(pinLength);
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

module.exports = {
  setPasswordReset,
};
