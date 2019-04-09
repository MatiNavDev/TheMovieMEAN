const { createUploadObject } = require('../services/s3/index').imageUpload;
const User = require('../model/user');
const ErrorText = require('../services/text/error');
const { makeCommonError } = require('../services/error');
const { sendOkResponse } = require('./helper/responses');
const { handleError } = require('./helper/error');
const { validateImageRequest } = require('../helpers/images/validators');

function imageUpload(req, res) {
  try {
    validateImageRequest(req.query);
    const { type } = req.query;
    const upload = createUploadObject(type);
    const singleUpload = upload.single('image');
    const { user } = res.locals;

    // Es necesario pasarle el mismo request y response que se recibio
    singleUpload(req, res, async err => {
      if (err) throw makeCommonError(ErrorText.IMG_UPL_ERROR, err.message);

      if (!req.file) throw makeCommonError(ErrorText.IMG_UPL_ERROR);

      const query = { _id: user._id };
      const objToUpdate = {
        $set: {
          image: req.file.location
        }
      };
      const options = {
        new: true
      };

      const { email, id, image, username } = await User.findOneAndUpdate(
        query,
        objToUpdate,
        options
      );

      const userToReturn = { email, id, image, username };
      return sendOkResponse(
        {
          user: userToReturn
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
