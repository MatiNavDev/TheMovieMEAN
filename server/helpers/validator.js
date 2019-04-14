const { makeCommonError } = require('../services/error');
const ErrorText = require('../services/text/error');

/**
 * Valida que las vars pasadas se encuentren como propiedades del objWithVars
 * @param {String[]} vars
 * @param {Object} objWithVars
 */
function validateRequireds(vars, objWithVars) {
  const varsNotFound = [];

  vars.forEach(v => {
    // si es null o undefined el front no envio la variable
    if (!objWithVars[v]) varsNotFound.push(v);
  });

  if (varsNotFound.length)
    return makeCommonError(
      ErrorText.NO_DATA,
      `Las variables '${varsNotFound.join(', ')}' son requeridas.`,
      422
    );
}

module.exports = {
  validateRequireds
};
