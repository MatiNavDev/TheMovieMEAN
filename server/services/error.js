/**
 * Crea y retorna un error común. \
 * Cualquier parámetro es opcional
 * @param {*} title
 * @param {*} description
 * @param {*} links
 * @param {*} statusCode
 */
function makeCommonError(title, description, statusCode) {
  title = title || 'Algo anduvo Mal !';
  description = description || '';
  statusCode = statusCode || 500;

  return {
    title,
    description,
    statusCode,
    customError: true
  };
}

module.exports = {
  makeCommonError
};
