const express = require('express');

const PostController = require('../controllers/post');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtiene los post de un usuario
router.get('/user/*?', AuthMiddleware.authMiddleware, PostController.getPostsFromUser);

router.get('/latest/:amount', AuthMiddleware.authMiddleware, PostController.getLatestPosts);
router.get(
  '/mostCommented/:amount',
  AuthMiddleware.authMiddleware,
  PostController.getMostCommentedPosts
);

router.get('/:postId', AuthMiddleware.authMiddleware, PostController.getFullPost);

// Obtiene los posts
router.get('', PostController.getPosts);

router.patch('/:postId', AuthMiddleware.authMiddleware, PostController.patchPost);

router.post('', AuthMiddleware.authMiddleware, PostController.postNewPost);

router.delete('/:postId', AuthMiddleware.authMiddleware, PostController.deletePost);

module.exports = router;
