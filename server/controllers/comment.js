const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const { verifyCommentFromUser } = require('../services/request-helpers/request-helpers');
const { sendOkResponse } = require('./helper/responses');
const ErrorText = require('../services/text/error.js');
const { handleError } = require('./helper/error');
const { makeCommonError } = require('../services/error');
const { validateGetPostsOrComments } = require('../helpers/validator');
const { decorateGetComments } = require('../helpers/decorator');
const { getLastPage } = require('../helpers/common');

// /////// PUBLIC FUNCTIONS //////////////

/**
 * Retorna los comentarios respecto a un post. Por default retorna 10, si se le pasa la cantidad entonces
 * devuelve esa cantidad
 * @param {*} req
 * @param {*} res
 */
async function getCommentsFromPost(req, res) {
  // El orden es por fecha ascendente (los mas recientes ultimos AL CONTRARIO DE LOS POSTS QUE ES MAS RECIENTE PRIMERO).
  // Tiene que devolver los comments asociados a una pagina. Y la consulta tendra un array de numeros los cuales seran las paginas
  // ejemplo: [1,2,3,4,5]. Ademas el front le debera pasar
  // al back la cantidad de comment por paginas. Cada comment debera llevar la hora que fue creado, por quien, la img del autor
  // Ademas se le debera pasar la cantidad de paginas.
  try {
    const { pagesRange, amountPerPage = 5 } = req.query;
    const { postId } = req.params;

    if (validateGetPostsOrComments({ pagesRange, postId }, ['pagesRange', 'postId'], res)) return;
    const pagesRangeParsed = JSON.parse(pagesRange);

    const firstPageFromRange = pagesRangeParsed[0] - 1;
    const lastPageFromRange = pagesRangeParsed[pagesRangeParsed.length - 1];

    const commentsFromPostQuery = { post: postId };
    const commentsAmountQuery = Comment.count(commentsFromPostQuery);
    const commentsForPaginationQuery = Comment.find(commentsFromPostQuery)
      .populate('user', 'username image')
      .skip(amountPerPage * firstPageFromRange)
      .limit(amountPerPage * lastPageFromRange)
      .sort([['created_at', 1]]);

    const [commentsAmount, commentsFromServer] = await Promise.all([
      commentsAmountQuery,
      commentsForPaginationQuery
    ]);

    const lastPage = getLastPage(commentsAmount, amountPerPage);
    const commentssDecorated = decorateGetComments(commentsFromServer);
    const comments = {};
    pagesRangeParsed.forEach((page, i) => {
      const commentsFromPage = commentssDecorated.slice(i * amountPerPage, amountPerPage * (i + 1));
      if (commentsFromPage.length) comments[page] = commentsFromPage;
    });
    return sendOkResponse({ items: comments, lastPage }, res);
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
    const { pagesRange, amountPerPage = 5 } = req.query;
    const { user } = res.locals;

    if (validateGetPostsOrComments({ pagesRange }, ['pagesRange'], res)) return;
    const pagesRangeParsed = JSON.parse(pagesRange);

    const firstPageFromRange = pagesRangeParsed[0] - 1;
    const lastPageFromRange = pagesRangeParsed[pagesRangeParsed.length - 1];

    const commentsFromUserQuery = { user: user.id };
    const commentsAmountQuery = Comment.count(commentsFromUserQuery);
    const commentsForPaginationQuery = Comment.find(commentsFromUserQuery)
      .populate('user', 'username image')
      .skip(amountPerPage * firstPageFromRange)
      .limit(amountPerPage * lastPageFromRange)
      .sort([['created_at', 1]]);

    const [commentsAmount, commentsFromServer] = await Promise.all([
      commentsAmountQuery,
      commentsForPaginationQuery
    ]);

    const lastPage = getLastPage(commentsAmount, amountPerPage);
    const commentssDecorated = decorateGetComments(commentsFromServer);
    const comments = {};
    pagesRangeParsed.forEach((page, i) => {
      const commentsFromPage = commentssDecorated.slice(i * amountPerPage, amountPerPage * (i + 1));
      if (commentsFromPage.length) comments[page] = commentsFromPage;
    });
    return sendOkResponse({ items: comments, lastPage }, res);
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
    const { amountPerPage } = req.query;
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

    const commentsFromPostQuery = { post: postId };
    const commentsAmountQuery = Comment.count(commentsFromPostQuery);

    const [commentsAmount] = await Promise.all([commentsAmountQuery, comment.save()]);

    const lastPage = getLastPage(commentsAmount, amountPerPage);

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

    return sendOkResponse({ newElement: commentParsed, lastPage }, res);
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
