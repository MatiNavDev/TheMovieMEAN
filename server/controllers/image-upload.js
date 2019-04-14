const { createUploadObject } = require('../services/s3/index').imageUpload;
const User = require('../model/user');
const Post = require('../model/post');
const ErrorText = require('../services/text/error');
const { makeCommonError } = require('../services/error');
const { sendOkResponse } = require('./helper/responses');
const { handleError } = require('./helper/error');
const { validateImageRequest } = require('../helpers/images/validators');
const { makeNotSupportedBucketError } = require('../helpers/images/error');

function imageUpload(req, res) {
  try {
    validateImageRequest(req.query);
    const { type, objId } = req.query;
    const upload = createUploadObject(type);
    const singleUpload = upload.single('image');

    // Es necesario pasarle el mismo request y response que se recibio
    singleUpload(req, res, async err => {
      if (err) throw makeCommonError(ErrorText.IMG_UPL_ERROR, err.message);

      if (!req.file) throw makeCommonError(ErrorText.IMG_UPL_ERROR);

      const query = { _id: objId };
      const objToUpdate = {
        $set: {
          image: req.file.location
        }
      };
      const options = {
        new: true
      };

      let model;

      switch (type) {
        case 'user':
          model = User;
          break;
        case 'post':
          model = Post;
          break;
        default:
          throw makeNotSupportedBucketError();
      }

      const { id, image } = await model.findOneAndUpdate(query, objToUpdate, options);

      const updatedObject = { id, image };
      return sendOkResponse(
        {
          updatedObject
        },
        res
      );
    });
  } catch (error) {
    return handleError(error, res);
  }
}

module.exports = {
  imageUpload
};
