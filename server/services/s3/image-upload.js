const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


const config = require('../../config/config');

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
const fileFilter = function (req, file, cb) {

    switch (file.mimetype) {
        case 'image/jpeg': case 'image/png':
            cb(null, true);
            break;
        default:
            cb(new Error('Los tipos permitidos de imagenes son JPEG y PNG'), false);
            break;
    }
};



/**
 * Setea el multer
 */
const upload = multer({
    fileFilter,
    storage: multerS3({
        acl: 'public-read',
        s3,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: config.S3_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING_METADATA' });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});



module.exports = upload;

