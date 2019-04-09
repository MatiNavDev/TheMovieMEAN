const { wrongCallToFunction } = require('../../services/logger');

/**
 * Envia una respuesta exitosa al usuario con la data enviada
 * @param {*} result
 * @param {*} res
 */
function sendOkResponse(result, res) {
  if (!res) wrongCallToFunction('sendOkResponse', [res]);

  const response = {
    result,
    status: 200
  };

  res.send(response);
}

/**
 * Envia una respuesta de error al usuario con el message y statusCode pasado. \
 * El statusCode por default es 400
 * @param {*} message
 * @param {*} statusCode
 * @param {*} res
 */
function sendErrorResponse(res, title, description, statusCode = 400) {
  if (!res) wrongCallToFunction('sendErrorResponse', [res]);

  res.status(statusCode).send({ errors: [{ title, description }] });
}

module.exports = {
  sendOkResponse,
  sendErrorResponse
};
