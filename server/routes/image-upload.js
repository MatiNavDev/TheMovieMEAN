const express = require('express');


const ImageUploadController = require('../controllers/image-upload');
const UserController = require('../controllers/user');



const router = express.Router();

router.post('/image-upload',UserController.authMiddleware ,ImageUploadController.imageUpload);


module.exports = router