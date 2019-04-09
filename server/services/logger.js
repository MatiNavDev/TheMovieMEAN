const { isString } = require('lodash');

/**
 * Loguea el llamado erroneo a una función
 * @param functionName
 * @param params
 */
function wrongCallToFunction(functionName, params) {
  if (!isString(functionName)) throw wrongCallToFunction('wrongCallToFunction', functionName);

  console.error(
    `La función ${functionName} fue llamada incorrectamente con los parámetros:`,
    params
  );
}

module.exports = {
  wrongCallToFunction
};
