const aws = require('aws-sdk');


const config = require('../../config/config');

aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    region: 'us-east-2'
});

const s3 = new aws.S3();




/**
 * Remueve todos los files pasados por parámetro
 * @param {*} keys 
 */
function removeFiles(keys) {
    return new Promise((resolve, reject) => {

        if (!keys.length) {
            resolve('ok');
        }

        const params = {
            Bucket: config.S3_BUCKET,
            Delete: {
                Objects: keys,
                Quiet: false
            }
        };
        s3.deleteObjects(params, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data)
            }
        })
    })

}

/**
 * Remueve todos los archivos del bucket de configuración
 */
function removeFilesFromBucket() {
    return new Promise((resolve, reject) => {

        const params = {
            Bucket: config.S3_BUCKET
        };
        s3.listObjectsV2(params, function (err, data) {
            if (err) {
                reject(err);
            }

             removeFiles(data.Contents.map(c => { return { Key: c.Key } }))
             .then(res=>resolve(res))
             .catch(e => reject(e));
        });

    });

}


module.exports = removeFilesFromBucket;

