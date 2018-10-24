const User = require('../model/user.js');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const mongooseHelpers = require('../helpers/mongoose');


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
 * Type: POST
 * Maneja cuando el usuario quiere loguearse
 * @param {*} req 
 * @param {*} res 
 */
function login(req, res) {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      errors: [{
        title: 'Falta Data !',
        description: 'El Email y la Contraseña son requeridos.'
      }]
    });
  }

  User.findOne({
    email
  }, (err, user) => {

    // Si hay error
    if (err) {
      return res.status(422).send(mongooseHelpers.normalizeErrors(err.errors));
    }

    // Si no esta el usuario
    if (!user) {
      return res.status(422).send({
        errors: [{
          title: 'Error !',
          description: 'Usuario no encontrado.'
        }]
      });
    }
    //Checkeo contraseñas
    if (user.hasSamePassword(password)) {
      const token = jwt.sign({
        userId: user._id,
        username: user.username
      }, config.SECRET, {
          expiresIn: '1h'
        });
      return res.json(token);
    } else {
      return res.status(422).send({
        errors: [{
          title: 'Usuario y Contraseña invalidos !',
          description: 'El Usuario o la Contraseña no existen.'
        }]
      });
    }

  })

}


/** 
 * Type: POST
 * Maneja cuando el usuario quiere registrarse
 * @param {*} req 
 * @param {*} res 
 */
function register(req, res) {
  const {
    password,
    email,
    username,
    confirmPassword
  } = req.body;

  if (!password || !confirmPassword || !username || !email) {
    return res.status(422).send({
      errors: [{
        title: 'Campos no enviados!',
        description: 'Usuario, Contraseña, Confirmacion Contraseña y Email son requeridos.'
      }]
    });
  }

  if (password !== confirmPassword) {
    return res.status(422).send({
      errors: [{
        title: 'Error con Contraseñas!',
        description: 'Las Contraseñas no coinciden.'
      }]
    });
  }


  User.findOne({
    email
  }, (err, userFound) => {

    if (err) {
      return res.status(422).send(mongooseHelpers.normalizeErrors(err.errors));
    }

    if (userFound) {
      return res.status(422).send({
        errors: [{
          title: 'Error con Email!',
          description: 'Email duplicado.'
        }]
      });
    }

    const user = new User({
      username,
      email,
      password
    });

    user.save((err) => {

      if (err) {
        return res.status(422).send(mongooseHelpers.normalizeErrors(err.errors));
      }

      const token = jwt.sign({
        userId: user._id,
        username: user.username
      }, config.SECRET, {
          expiresIn: '1h'
        });
      res.send({
        user,
        token
      });
    });

  });
};


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
  login,
  register,
  authMiddleware
}