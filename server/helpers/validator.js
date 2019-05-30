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

/**
 * Valida que el request al post sea correcto. Si tira error, entonces retorna verdadero
 * @param {*} objWithVars
 * @param {*} varsToValidate
 * @param {*} res
 */
function validateGetPostsOrComments(objWithVars, varsToValidate, res) {
  let { pagesRange } = objWithVars;
  pagesRange = JSON.parse(pagesRange);
  const requiredError = validateRequireds(varsToValidate, objWithVars);
  const formatError = !Array.isArray(pagesRange)
    ? makeCommonError(
        ErrorText.FORMAT_ERROR,
        ErrorText.GET_POSTORCOMMENT_FORMAT_ERROR + typeof pagesRange,
        422
      )
    : null;

  if (requiredError || formatError) {
    res.status(422).send({ errors: [requiredError, formatError] });
    return true;
  }
}

module.exports = {
  validateRequireds,
  validateGetPostsOrComments
};
