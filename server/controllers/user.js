const User = require('../model/user.js');
const tokenSrvc = require('../services/token/token');
const { sendOkResponse } = require('./helper/responses');
const { handleError } = require('./helper/error');
const { makeCommonError } = require('../services/error');
const ErrorText = require('../services/text/error.js');

// /////////////////////// PUBLIC FUNCTIONS /////////////////////////

/**
 * Type: POST
 * Maneja cuando el usuario quiere loguearse
 * @param {*} req
 * @param {*} res
 */
async function login(req, res) {
  // TODO: manejar traer al usuario con su respectiva imagen
  try {
    const { email, password } = req.body;

    if (!email || !password) throw makeCommonError(ErrorText.NO_DATA, ErrorText.NO_USER_PASS, 422);

    const user = await User.findOne({ email });

    if (!user) {
      throw makeCommonError(ErrorText.WRONG_USER_PASS, ErrorText.NO_EXISTS_USER_PASS, 422);
    }
    // Checkeo contraseñas
    if (!user.hasSamePassword(password))
      throw makeCommonError(ErrorText.WRONG_USER_PASS, ErrorText.NO_EXISTS_USER_PASS, 422);

    const token = tokenSrvc.makeToken(user);

    sendOkResponse(
      {
        token,
        user
      },
      res
    );
  } catch (e) {
    handleError(e, res);
  }
}

/**
 * Type: POST
 * Maneja cuando el usuario quiere registrarse
 * @param {*} req
 * @param {*} res
 */
async function register(req, res) {
  try {
    const { password, email, username, confirmPassword } = req.body;

    if (!password || !confirmPassword || !username || !email)
      throw makeCommonError(ErrorText.NO_DATA, ErrorText.NO_REGISTER_FIELDS, 422);

    if (password !== confirmPassword)
      throw makeCommonError(ErrorText.PASS_ERROR, ErrorText.WRONG_CONFIRMATION_PASS, 422);

    const userFound = await User.findOne({
      email
    });

    if (userFound) throw makeCommonError(ErrorText.EMAIL_ERROR, ErrorText.DUPLICATED_EMAIL, 422);

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    const token = tokenSrvc.makeToken(user);
    const parsedUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      image: user.image
    };

    return sendOkResponse(
      {
        user: parsedUser,
        token
      },
      res
    );
  } catch (e) {
    return handleError(e, res);
  }
}

module.exports = {
  login,
  register
};
