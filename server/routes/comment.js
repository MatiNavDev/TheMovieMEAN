const express = require('express');

const CommentController = require('../controllers/comment');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/post/:postId/*?', AuthMiddleware.authMiddleware, CommentController.getCommentsFromPost);

router.get('/*?', AuthMiddleware.authMiddleware, CommentController.getCommentsFromUser);



module.exports = router;
