const { validateRequireds } = require('../validator');
const { makeCommonError } = require('../../services/error');
const ErrorText = require('../../services/text/error');
/**
 * Valida que el request al post sea correcto. Si tira error, entonces retorna verdadero
 * @param {*} objWithVars
 * @param {*} res
 */
function validateGetPosts(objWithVars, res) {
  let { pagesRange } = objWithVars;
  pagesRange = JSON.parse(pagesRange);
  const requiredError = validateRequireds(['pagesRange'], objWithVars);
  const formatError = !Array.isArray(pagesRange)
    ? makeCommonError(
        ErrorText.FORMAT_ERROR,
        ErrorText.GET_POST_FORMAT_ERROR + typeof pagesRange,
        422
      )
    : null;

  if (requiredError || formatError) {
    res.status(422).send({ errors: [requiredError, formatError] });
    return true;
  }
}

module.exports = {
  validateGetPosts
};
