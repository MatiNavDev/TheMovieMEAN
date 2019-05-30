const { verifyPostsFromUser } = require('../services/request-helpers/request-helpers');
const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const { sendOkResponse } = require('./helper/responses');
const { handleError } = require('./helper/error');
const { makeCommonError } = require('../services/error');
const ErrorText = require('../services/text/error.js');
const { validateGetPostsOrComments } = require('../helpers/validator');
const { decorateGetPosts } = require('../helpers/posts/decorator');
const { getLastPage } = require('../helpers/common');

// /////// public methods //////////////

/**
 * Retorna los últimos post. Si se le pasa la cantidad con el /cantidad, devolverá dicha cantidad
 * de posts, sino devuelve 10.
 * @param {*} req
 * @param {*} res
 */
async function getPosts(req, res) {
  // Se tienen que poder ordenar por mas populares (con mas respuestas), o por mas recientes (fecha descendete)(default).
  // Tiene que devolver los posts asociados a una pagina. Y la consulta tendra un array de numeros los cuales seran las paginas
  // ejemplo: [1,2,3,4,5]. Ademas el front le debera pasar
  // al back la cantidad de post por paginas. Cada post debera llevar la hora que fue creada, por quien,
  // la hora del ultimo mensaje, por quien. Ademas se le debera pasar la cantidad de paginas.
  try {
    const { sortField = 'createdAt', pagesRange, amountPerPage = 5 } = req.query;

    if (validateGetPostsOrComments(req.query, ['pagesRange'], res)) return;
    const pagesRangeParsed = JSON.parse(pagesRange);

    const firstPageFromRange = pagesRangeParsed[0] - 1;
    const lastPageFromRange = pagesRangeParsed[pagesRangeParsed.length - 1];

    const postsAmountQuery = Post.count();
    const postsForPaginationQuery = Post.find()
      .populate({
        path: 'comments',
        options: {
          limit: 1,
          sort: { createdAt: -1 }
        },
        select: { createdAt: 1 },
        populate: {
          path: 'user',
          select: { username: 1 }
        }
      })
      .populate('user', 'username')
      .skip(amountPerPage * firstPageFromRange)
      .limit(amountPerPage * lastPageFromRange)
      .sort([[sortField, -1]]);

    const [postsAmount, postsFromServer] = await Promise.all([
      postsAmountQuery,
      postsForPaginationQuery
    ]);

    const lastPage = getLastPage(postsAmount, amountPerPage);

    const postsDecorated = decorateGetPosts(postsFromServer);
    const posts = {};
    pagesRangeParsed.forEach((page, i) => {
      const postsFromPage = postsDecorated.slice(i * amountPerPage, amountPerPage * (i + 1));
      if (postsFromPage.length) posts[page] = postsFromPage;
    });

    return sendOkResponse({ items: posts, lastPage }, res);
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
    // validateVarsToPatch(updateObject, ['title', 'message', 'image']);

    // TODO: valida que las variables, si es que se van a patchear, no sean null
    // validateVarsNotNullIffExists(updateObject, ['title', 'message']);

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
        newElement: parsedPost
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

/**
 * Maneja el obtener toda la data asociada a un post (solo la data del post, no los comentarios asociados).
 * @param {*} req
 * @param {*} res
 */
async function getFullPost(req, res) {
  /**
   * No es necesaria realizar ninguna verificacion, simplemente traer el post.
   * Ademas se le debera enviar el nombre y el usuario por ahora (TODO: agregarle toda la data necesaria, ver 3djuegos)
   */
  try {
    const { postId } = req.params;

    const fullPost = await Post.findById(postId).populate('user', 'username image');

    return sendOkResponse({ fullPost }, res);
  } catch (e) {
    handleError(e, res);
  }
}

/**
 * Obtiene los ultimos posts creados
 * @param {*} req
 * @param {*} res
 */
async function getLatestPosts(req, res) {
  try {
    const { amount } = req.params;

    const latestPosts = await Post.find()
      .sort([['createdAt', -1]])
      .limit(Number(amount));

    return sendOkResponse({ latestPosts }, res);
  } catch (e) {
    handleError(e, res);
  }
}

/**
 * Obtiene los posts mas comentados
 * @param {*} req
 * @param {*} res
 */
async function getMostCommentedPosts(req, res) {
  try {
    const { amount } = req.params;
    const mostCommentedPostsRef = await Comment.aggregate([
      { $sortByCount: '$post' },
      { $limit: +amount }
    ]);
    const ids = mostCommentedPostsRef.map(p => p._id.toString());

    let mostCommentedPosts = await Post.find({ _id: { $in: ids } }).select('title image');
    mostCommentedPosts = mostCommentedPosts.map(p => ({
      id: p.id,
      image: p.image,
      title: p.title
    }));
    return sendOkResponse({ mostCommentedPosts }, res);
  } catch (e) {
    handleError(e, res);
  }
}

module.exports = {
  getPosts,
  getPostsFromUser,
  patchPost,
  postNewPost,
  deletePost,
  getFullPost,
  getLatestPosts,
  getMostCommentedPosts
};
