const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('../../config/config');
const { makeNotSupportedBucketError } = require('../../helpers/images/error');

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: 'us-east-2'
});

const s3 = new aws.S3();

/**
 * Filtra de archivos permitidos
 * @param {*} req
 * @param {*} file
 * @param {*} cb
 */
const fileFilter = function(req, file, cb) {
  switch (file.mimetype) {
    case 'image/jpeg':
    case 'image/png':
      cb(null, true);
      break;
    default:
      cb(new Error('Los tipos permitidos de imagenes son JPEG y PNG'), false);
      break;
  }
};

/**
 * Crea un objeto el cual subira la imagen a S3. La carpeta se definira por el tipo
 * de imagen a guardar
 * @param {'user' | 'post'} type
 */
function createUploadObject(type) {
  let bucket;

  switch (type) {
    case 'user':
      bucket = config.S3_USER_BUCKET;
      break;
    case 'post':
      bucket = config.S3_POST_BUCKET;
      break;
    default:
      throw makeNotSupportedBucketError();
  }

  return multer({
    fileFilter,
    storage: multerS3({
      acl: 'public-read',
      s3,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      bucket,
      metadata(req, file, cb) {
        cb(null, { fieldName: 'TESTING_METADATA' });
      },
      key(req, file, cb) {
        cb(null, Date.now().toString());
      }
    })
  });
}

module.exports = { createUploadObject };
