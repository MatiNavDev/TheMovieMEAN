const jwt = require('jsonwebtoken');

const User = require('../model/user');
const config = require('../config/config');

///////////////////////// PRIVATE FUNCTIONS /////////////////////////


/**
 * Parsea el jwt token y lo devuelve
 * @param {*} token 
 */
function parseToken(token) {
    return jwt.decode(token, config.SECRET);
}



///////////////////////// PUBLIC FUNCTIONS /////////////////////////



/**
 * Maneja la lógica de la autenticacion del usuario
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function authMiddleware(req, res, next) {

    const token = req.headers.authorization;
  
    if(!token){
      return res.status(422).send({ errors: [{ title: 'No autorizado !', description: 'Token no enviado.' }] })
    }
  
    const jwtToken = token.split(' ')[1]
    let userReceived;
    if (jwtToken) {
  
      try {
        userReceived = parseToken(jwtToken);
      } catch (e) {
        return res.status(422).send({ errors: [{ title: 'No autorizado !', description: 'Token inválido.' }] })
      }
  
      User.findById(userReceived.userId)
      .then(userFound=>{
  
        if(!userFound){
          return res.status(422).send({ errors: [{ title: 'No autorizado !', description: 'Por favor, inicie sesión.' }] })
        }
  
        res.locals.user = userFound;
        next();
  
      })
      .catch(e=>res.status(422).send(mongooseHelpers.normalizeErrors(e.errors)))
  
    } else {
      return res.status(422).send({ errors: [{ title: 'No autorizado !', description: 'Por favor, inicie sesión.' }] })
    }
  
  }


module.exports = {
  authMiddleware
}