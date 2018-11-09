const express = require('express');

const PostController = require('../controllers/post');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtiene los post de un usuario
router.get('/user/*?', AuthMiddleware.authMiddleware, PostController.getPostsFromUser);

// Obtiene los posts
router.get('/*?', AuthMiddleware.authMiddleware, PostController.getPosts);

router.patch('/:id', AuthMiddleware.authMiddleware, PostController.patchPost);

router.post('', AuthMiddleware.authMiddleware, PostController.postNewPost);

module.exports = router;
