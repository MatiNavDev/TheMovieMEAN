const upload = require('../services/image-upload');



module.exports.imageUpload = function (req, res){
    const singleUpload = upload.single('image');

    singleUpload(req, res, (err)=> {
        if(err){
            return res.status(422).send({errors:[{title:'Image Upload Error', description: err.message}]});
        }

        if(req.file){
            return res.send({imageUrl: req.file.location});
        } else {
            return res.status(422).send({errors:[{title:'Error', description: 'Algo anduvo mal !!'}]});            
        }
    }); 
};