const express = require('express');

const PostController = require('../controllers/post');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtiene los post de un usuario
router.get('/user/*?', AuthMiddleware.authMiddleware, PostController.getPostsFromUser);

// Obtiene los posts
router.get('/*?', AuthMiddleware.authMiddleware, PostController.getPosts);

router.patch('/:postId', AuthMiddleware.authMiddleware, PostController.patchPost);

router.post('', AuthMiddleware.authMiddleware, PostController.postNewPost);

router.delete('/:postId', AuthMiddleware.authMiddleware, PostController.deletePost);

module.exports = router;
