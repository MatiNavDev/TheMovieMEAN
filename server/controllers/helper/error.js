const { sendErrorResponse } = require('./responses');
const { wrongCallToFunction } = require('../../services/logger');
const { normalizeErrors: handleMongooseError } = require('../../helpers/mongoose');

/**
 * Funcion manejadora de error la cual recibe el mismo y envía la estructura del error correspondiente
 * al usuario
 * @param {*} error
 * @param {*} res
 */
function handleError(error, res) {
  if (!res || !error) wrongCallToFunction('handleError', [error, res]);

  console.log(error);

  if (error.errors) {
    return res.status(422).send(handleMongooseError(error.errors));
  }
  if (error.customError) {
    sendErrorResponse(res, error.title, error.description, error.statusCode);
  } else {
    sendErrorResponse(res, 'Algo anduvo mal !', '', 500);
  }
}

module.exports = {
  handleError
};
