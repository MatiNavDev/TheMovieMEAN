const { makeCommonError } = require('../../services/error');
const ErrorText = require('../../services/text/error');

/**
 * Valida el request a la imagen
 * @param {*} objWithVars
 */
function validateImageRequest(objWithVars) {
  if (!objWithVars.type) throw makeCommonError(ErrorText.NO_DATA, ErrorText.NO_TYPE, 422);
}

module.exports = {
  validateImageRequest
};
