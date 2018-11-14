const jwt = require('jsonwebtoken');

const config = require('../../config/config');

/**
 * Genera un token
 * @param {*} user
 */
function makeToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username
    },
    config.SECRET,
    {
      expiresIn: '4h'
    }
  );
}

module.exports = {
  makeToken
};
