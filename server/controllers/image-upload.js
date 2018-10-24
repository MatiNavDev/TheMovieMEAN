const upload = require('../services/s3/index').imageUpload;
const User = require('../model/user');



module.exports.imageUpload = function (req, res) {
  const singleUpload = upload.single('image');
  const user = res.locals.user;

  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).send({
        errors: [{
          title: 'Image Upload Error',
          description: err.message
        }]
      });
    }

    if (req.file) {
      const query = { _id: user._id};
      const objToUpdate = {
          $set:{
              image :req.file.location
          }
      }
      const options = {
          new: true}


      User.findOneAndUpdate(query, objToUpdate,options, function (err, updatedUser) {

        if (err)
          return res.status(422).send({
            errors: [{
              title: 'Error al actualizar!',
              detail: 'No se pudo encontrar el usuario!'
            }]
          });

        return res.send({
          user: updatedUser
        });
      });


    } else {
      return res.status(422).send({
        errors: [{
          title: 'Error',
          description: 'Algo anduvo mal !!'
        }]
      });
    }
  });
};