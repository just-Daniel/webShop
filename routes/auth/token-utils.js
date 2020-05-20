const jwt = require('jsonwebtoken');
const config = require('config');
const ResponseError = require('./response-error');
const User = require('../../models/user');

const getDecodedToken = (request) => {
  const promise = new Promise((resolve, reject) => {
    const data = request.query;
    const token = data.access_token;
    const privateKey = config.get('token-config');

    if (token) {
      jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
          reject(new ResponseError('No token provided', 400));
        }
        resolve(decoded);
      });
    }
    reject(new ResponseError('Failed to authenticate token.', 500));
  });
  return promise;
};

const getUserToken = (request) => {
  const promise = new Promise((resolve, reject) => {
    getDecodedToken(request)
        .then((decoded) => User.findOne({where: {
          id: decoded.id,
          password: decoded.password,
        }}).then((row) => resolve(row)))
        .catch((err) => reject(err));
  });
  return promise;
};

module.exports.getDecodedToken = getDecodedToken;
module.exports.getUserToken = getUserToken;
