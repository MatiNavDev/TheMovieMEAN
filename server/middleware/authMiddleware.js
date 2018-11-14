const jwt = require('jsonwebtoken');

const User = require('../model/user');
const config = require('../config/config');
const mongooseHelpers = require('../helpers/mongoose');

// /////////////////////// PRIVATE FUNCTIONS /////////////////////////

/**
 * Parsea el jwt token y lo devuelve
 * @param {*} token
 */
function parseToken(token) {
  jwt.verify(token, config.SECRET);
  return jwt.decode(token, config.SECRET);
}

// /////////////////////// PUBLIC FUNCTIONS /////////////////////////

/**
 * Maneja la lógica de la autenticacion del usuario
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .send({ errors: [{ title: 'No autorizado !', description: 'Token no enviado.' }] });
    }

    const jwtToken = token.split(' ')[1];
    let userReceived;
    if (jwtToken) {
      try {
        userReceived = parseToken(jwtToken);
      } catch (e) {
        return res
          .status(401)
          .send({ errors: [{ title: 'No autorizado !', description: 'Token inválido.' }] });
      }

      const userFound = await User.findById(userReceived.userId);
      if (!userFound) {
        return res.status(401).send({
          errors: [{ title: 'No autorizado !', description: 'Por favor, inicie sesión.' }]
        });
      }

      res.locals.user = userFound;
      return next();
    }
    return res
      .status(401)
      .send({ errors: [{ title: 'No autorizado !', description: 'Por favor, inicie sesión.' }] });
  } catch (e) {
    res.status(401).send(mongooseHelpers.normalizeErrors(e.errors));
  }
}

module.exports = {
  authMiddleware
};
