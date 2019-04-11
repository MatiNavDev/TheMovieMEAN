const { makeCommonError } = require('../../services/error');
const ErrorText = require('../../services/text/error');

/**
 * Tira un error de tipo de imagen no soportada (en cuanto a user, post etc)
 */
function makeNotSupportedBucketError() {
  return makeCommonError(ErrorText.IMG_UPL_ERROR, ErrorText.BUCKET_ERROR);
}

module.exports = {
  makeNotSupportedBucketError
};
