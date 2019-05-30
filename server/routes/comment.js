const express = require('express');

const CommentController = require('../controllers/comment');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/user/*?', AuthMiddleware.authMiddleware, CommentController.getCommentsFromUser);

router.get('/:postId', AuthMiddleware.authMiddleware, CommentController.getCommentsFromPost);

router.patch('/:commentId', AuthMiddleware.authMiddleware, CommentController.patchComment);

router.post('/:postId', AuthMiddleware.authMiddleware, CommentController.postNewComment);

router.delete('/:commentId', AuthMiddleware.authMiddleware, CommentController.deleteComment);

module.exports = router;
