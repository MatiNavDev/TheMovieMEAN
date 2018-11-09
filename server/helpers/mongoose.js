/**
 * Normaliza los errores producidos por mongoose. Devuelve un array de { title, message}
 * @param {*} errors
 */
function normalizeErrors(errors) {
  if (!errors) return { title: 'Error', message: 'Algo anduvo mal !' };

  const decoratedErrors = [];
  Object.keys(errors).forEach(property => {
    decoratedErrors.push({ title: property, message: errors[property].message });
  });
  return normalizeErrors;
}

module.exports = {
  normalizeErrors
};
