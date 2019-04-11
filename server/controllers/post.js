const { verifyPostsFromUser } = require('../services/request-helpers/request-helpers');
const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const { sendOkResponse } = require('./helper/responses');
const { handleError } = require('./helper/error');
const { makeCommonError } = require('../services/error');
const ErrorText = require('../services/text/error.js');

// /////// public methods //////////////

/**
 * Retorna los últimos post. Si se le pasa la cantidad con el /cantidad, devolverá dicha cantidad
 * de posts, sino devuelve 10.
 * @param {*} req
 * @param {*} res
 */
async function getPosts(req, res) {
  // TODO: manejar el traer el post con su respectiva imagen
  try {
    let firstParam = req.params[0];
    if (firstParam) [firstParam] = firstParam.split('/');
    const amount = parseInt(firstParam || 10, 10);

    const posts = await Post.find()
      .select('createdAt message title _id image')
      .limit(amount);

    return sendOkResponse(posts, res);
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Retorna los últimos post del user. Si se le pasa la cantidad con el /user/cantidad, devolverá dicha cantidad
 * de posts, sino devuelve 10.
 * @param {*} req
 * @param {*} res
 */
async function getPostsFromUser(req, res) {
  try {
    let firstParam = req.params[0];
    if (firstParam) [firstParam] = firstParam.split('/');
    const amount = parseInt(firstParam || 10, 10);
    const { user } = res.locals;

    const userPopulated = await User.findById(user.id).populate({
      path: 'posts',
      options: {
        limit: amount
      },
      select: 'createdAt message title _id'
    });

    return sendOkResponse(userPopulated.posts, res);
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Modifica un post
 * @param {*} req
 * @param {*} res
 */
async function patchPost(req, res) {
  const { user } = res.locals;

  const { postId } = req.params;

  const { updateObject } = req.body;

  if (!postId) throw makeCommonError(ErrorText.WRONG_ID, ErrorText.WRONG_POST_ID, 409);

  try {
    if (!postId) throw makeCommonError(ErrorText.WRONG_ID, ErrorText.WRONG_POST_ID, 409);

    if (!Object.keys(updateObject).length)
      throw makeCommonError(ErrorText.NO_DATA, ErrorText.NO_DATA, 422);

    // TODO: validar que las variables a patchear se encuentren dentro del array pasado
    validateVarsToPatch(updateObject, ['title', 'message', 'image']);

    // TODO: valida que las variables, si es que se van a patchear, no sean null
    validateVarsNotNullIffExists(updateObject, ['title', 'message']);

    const isVerified = verifyPostsFromUser(postId, user);

    if (!isVerified)
      throw makeCommonError(ErrorText.WRONG_PERMISSIONS, ErrorText.POST_NOT_FROM_USER, 403);

    const post = await Post.findByIdAndUpdate(postId, { $set: updateObject }, { new: true }).select(
      'message createdAt title'
    );

    return sendOkResponse({ post }, res);
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Crea un nuevo Post
 * @param {*} req
 * @param {*} res
 */
async function postNewPost(req, res) {
  try {
    const { title, message } = req.body;

    const { user } = res.locals;

    if (!title || !message)
      throw makeCommonError(ErrorText.NO_DATA, ErrorText.NO_MESSAGE_TITLE, 422);

    const post = new Post({
      title,
      message,
      user
    });

    await post.save();

    const query = {
      _id: user._id
    };

    const docUpdate = {
      $push: {
        posts: post
      }
    };

    await User.updateOne(query, docUpdate);

    const parsedPost = {
      _id: post._id,
      title: post.title,
      message: post.message,
      image: post.image,
      createdAt: post.createdAt
    };

    return sendOkResponse(
      {
        post: parsedPost
      },
      res
    );
  } catch (e) {
    return handleError(e, res);
  }
}

/**
 * Borra el post especificado actualizando el usuario y los comentarios asociados al post
 * @param {*} req
 * @param {*} res
 */
async function deletePost(req, res) {
  /**
   * Primero valida que el post le pertenezca al user,
   * despues elimina los comentarios asociados al post, y despues
   * elimina el post.
   * por ultimo actualiza el post del la lista de posts del usuario
   */

  try {
    const { postId } = req.params;
    const { user } = res.locals;

    const isVerified = verifyPostsFromUser(postId, user);

    if (!isVerified)
      throw makeCommonError(ErrorText.WRONG_PERMISSIONS, ErrorText.POST_NOT_FROM_USER, 403);

    const [deletedComments, , respDeletePost] = await Promise.all([
      Comment.find({ post: postId }),
      Comment.deleteMany({ post: postId }),
      Post.findByIdAndDelete(postId)
    ]);

    const deletedCommentIds = deletedComments.map(deletedComment => deletedComment.id);
    // SI ES CON POPULATE MUESTRA 11, SI ES SIN POPULATE MUESTRA 12

    const query = { _id: user.id };
    const docUpdateUser = {
      $pull: { posts: postId, comments: { $in: deletedCommentIds } }
    };

    await User.updateOne(query, docUpdateUser);

    return sendOkResponse({ deletedPost: respDeletePost }, res);
  } catch (e) {
    handleError(e, res);
  }
}

module.exports = {
  getPosts,
  getPostsFromUser,
  patchPost,
  postNewPost,
  deletePost
};
