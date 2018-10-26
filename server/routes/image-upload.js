const express = require('express');


const ImageUploadController = require('../controllers/image-upload');
const AuthMiddleware = require('../middleware/authMiddleware');



const router = express.Router();

router.post('/image-upload', AuthMiddleware.authMiddleware ,ImageUploadController.imageUpload);


module.exports = router