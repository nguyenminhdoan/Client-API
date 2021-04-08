const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

const setJWT = function (key, value) {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (err, res) => {
        if (err) reject(err);
        resolve(res);
        // console.log(key, value);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getJWT = function (key) {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  setJWT,
  getJWT,
};
