const User = require('../model/user.js');
const mongooseHelpers = require('../helpers/mongoose');
const tokenSrvc = require('../services/token/token');

// /////////////////////// PUBLIC FUNCTIONS /////////////////////////

/**
 * Type: POST
 * Maneja cuando el usuario quiere loguearse
 * @param {*} req
 * @param {*} res
 */
function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      errors: [
        {
          title: 'Falta Data !',
          description: 'El Email y la Contraseña son requeridos.'
        }
      ]
    });
  }

  User.findOne(
    {
      email
    },
    (err, user) => {
      // Si hay error
      if (err) {
        return res.status(422).send(mongooseHelpers.normalizeErrors(err.errors));
      }

      // Si no esta el usuario
      if (!user) {
        return res.status(422).send({
          errors: [
            {
              title: 'Error !',
              description: 'Usuario no encontrado.'
            }
          ]
        });
      }
      // Checkeo contraseñas
      if (user.hasSamePassword(password)) {
        const token = tokenSrvc.makeToken(user);

        return res.json({
          token,
          user
        });
      }
      return res.status(422).send({
        errors: [
          {
            title: 'Usuario y Contraseña invalidos !',
            description: 'El Usuario o la Contraseña no existen.'
          }
        ]
      });
    }
  );
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

    if (!password || !confirmPassword || !username || !email) {
      return res.status(422).send({
        errors: [
          {
            title: 'Campos no enviados!',
            description: 'Usuario, Contraseña, Confirmacion Contraseña y Email son requeridos.'
          }
        ]
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).send({
        errors: [
          {
            title: 'Error con Contraseñas!',
            description: 'Las Contraseñas no coinciden.'
          }
        ]
      });
    }

    const userFound = await User.findOne({
      email
    });

    if (userFound) {
      return res.status(422).send({
        errors: [
          {
            title: 'Error con Email!',
            description: 'Email duplicado.'
          }
        ]
      });
    }

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

    return res.send({
      user: parsedUser,
      token
    });
  } catch (e) {
    return res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
  }
}

module.exports = {
  login,
  register
};
