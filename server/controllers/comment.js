const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const { verifyCommentFromUser } = require('../services/request-helpers/request-helpers');
const { sendOkResponse } = require('./helper/responses');
const ErrorText = require('../services/text/error.js');
const { handleError } = require('./helper/error');
const { makeCommonError } = require('../services/error');

// /////// PUBLIC FUNCTIONS //////////////

/**
 * Retorna los comentarios respecto a un post. Por default retorna 10, si se le pasa la cantidad entonces
 * devuelve esa cantidad
 * @param {*} req
 * @param {*} res
 */
async function getCommentsFromPost(req, res) {
  try {
    const { postId } = req.params;
    let { amount } = req.query;
    amount = parseInt(amount || 10, 10);

    if (!postId) throw makeCommonError(ErrorText.WRONG_ID, ErrorText.WRONG_POST_ID, 400);

    const foundPost = await Post.findById(postId).populate({
      path: 'comments',
      options: {
        limit: amount,
        sort: { createdAt: 1 }
      }
    });

    if (!foundPost) throw makeCommonError(ErrorText.WRONG_ID, ErrorText.WRONG_POST_ID, 400);

    return sendOkResponse({ comments: foundPost.comments }, res);
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Retorna los comentarios respecto a un usuario. Por default retorna 10, si se le pasa la cantidad entonces
 * devuelve esa cantidad.
 * @param {*} req
 * @param {*} res
 */
async function getCommentsFromUser(req, res) {
  try {
    let { amount } = req.query;
    amount = parseInt(amount || 10, 10);
    const { user } = res.locals;

    const foundUser = await User.findById(user.id).populate({
      path: 'comments',
      options: {
        limit: amount
      }
    });

    return sendOkResponse({ comments: foundUser.comments }, res);
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Modifica un comentario
 * @param {*} req
 * @param {*} res
 */
async function patchComment(req, res) {
  /**
   * Primero debería chequear que le llegue el id del comentario, luego que llegue el message
   * despues que dicho comentario le pertenezca al usuario. Luego modificarlo y guardarlo.
   */
  try {
    const { commentId } = req.params;
    const { message } = req.body;
    const { user } = res.locals;

    if (!commentId) throw makeCommonError(ErrorText.WRONG_ID, ErrorText.NO_COMMENT_ID, 400);

    if (!message) throw makeCommonError(ErrorText.NO_DATA, ErrorText.MIN_SEND_MSG, 422);

    const isVerified = verifyCommentFromUser(commentId, user);

    if (!isVerified)
      throw makeCommonError(ErrorText.WRONG_PERMISSIONS, ErrorText.COMMENT_NOT_FROM_USER, 403);

    const properties = {
      message
    };
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: properties },
      { fields: { id: 1, message: 1, createdAt: 1 } }
    ).select('message createdAt');

    return sendOkResponse({ comment }, res);
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Crea un nuevo comentario
 * @param {*} req
 * @param {*} res
 */
async function postNewComment(req, res) {
  /**
   * Primero verificar que llegue el message, luego crear el comment (asociando el comment),
   * y con el comment creado setearselo al usuario actualizando el mismo.
   */

  try {
    const { message } = req.body;
    const { postId } = req.params;
    const { user } = res.locals;

    if (!message) throw makeCommonError(ErrorText.NO_DATA, ErrorText.NO_MESSAGE, 422);

    const post = await Post.findById(postId);

    if (!post) throw makeCommonError(ErrorText.WRONG_ID, ErrorText.WRONG_POST_ID, 400);

    const comment = new Comment({
      message,
      user,
      post
    });

    await comment.save();

    const userQuery = { _id: user.id };
    const postQuery = { _id: postId };

    const userDocUpdate = {
      $push: { comments: comment }
    };
    const postDocUpdate = {
      $push: { comments: comment }
    };

    await Promise.all([
      User.updateOne(userQuery, userDocUpdate),
      Post.updateOne(postQuery, postDocUpdate)
    ]);

    const commentParsed = {
      _id: comment.id,
      message: comment.message,
      createdAt: comment.createdAt
    };

    return sendOkResponse({ comment: commentParsed }, res);
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Borra el comentario especificado actualizando el usuario y el post asociados al comentario
 * @param {*} req
 * @param {*} res
 */
async function deleteComment(req, res) {
  /**
   * Verifica que el comentario le pertenece al usuario
   * Elimina el comentario
   * Elimina el comentario de la lista de comentarios del post asociado
   * Elimina el comentario de la lista de comentarios del usuario
   */

  try {
    const { commentId } = req.params;
    const { user } = res.locals;

    const isVerified = verifyCommentFromUser(commentId, user);

    if (!isVerified)
      throw makeCommonError(ErrorText.WRONG_PERMISSIONS, ErrorText.COMMENT_NOT_FROM_USER, 403);

    const respDeletedComment = await Comment.findByIdAndDelete(commentId);

    const queryPost = { comments: commentId };
    const docUpdatePost = { $pull: { comments: commentId } };

    await Post.updateOne(queryPost, docUpdatePost);

    const queryUser = { _id: user.id };
    const docUpdateUser = { $pull: { comments: commentId } };
    await User.updateOne(queryUser, docUpdateUser);

    return sendOkResponse({ deletedComment: respDeletedComment }, res);
  } catch (e) {
    return handleError(e, res);
  }
}

module.exports = {
  getCommentsFromPost,
  getCommentsFromUser,
  patchComment,
  postNewComment,
  deleteComment
};
