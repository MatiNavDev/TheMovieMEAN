const express = require('express');

const PostController = require('../controllers/post');
const AuthMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

// Obtiene todos los post de un usuario
router.get('/user/*?', AuthMiddleware.authMiddleware ,PostController.getPostsFromUser);

// Obtiene todos los posts
router.get('/*?', AuthMiddleware.authMiddleware ,PostController.getPosts);



module.exports = router;
