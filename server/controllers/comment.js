const mongooseHelpers = require('../helpers/mongoose');
const Comment = require('../model/comment');
const Post = require('../model/post');
const User = require('../model/user');

/**
 * Verifica si un comentrio pertenece a un usuario
 * @param {*} comment
 * @param {*} user
 */
function verifyCommentFromUser(comment, user) {
  return true;
}

// /////// PUBLIC FUNCTIONS //////////////

/**
 * Retorna los comentarios respecto a un post. Por default retorna 10, si se le pasa la cantidad entonces
 * devuelve esa cantidad
 * @param {*} req
 * @param {*} res
 */
async function getCommentsFromPost(req, res) {
  try {
    const { postId } = req.query;
    let { amount } = req.query;
    amount = parseInt(amount || 10, 10);

    if (!postId)
      return res.status(400).send({
        errors: [
          {
            title: 'Id Erroneo',
            description: 'El id no corresponde a ningún post'
          }
        ]
      });

    const foundPost = await Post.findById(postId).populate({
      path: 'comments',
      options: {
        limit: amount
      }
    });

    if (!foundPost)
      return res.status(400).send({
        errors: [
          {
            title: 'Id Erroneo',
            description: 'El id no corresponde a ningún post'
          }
        ]
      });

    return res.send(foundPost.comments);
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

    return res.send(foundUser.comments);
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
  }
}

/**
 * Modifica un comentario
 * @param {*} req
 * @param {*} res
 */
function patchComment(req, res) {
  return res.send('patchComment');
}

/**
 * Crea un nuevo comentario
 * @param {*} req
 * @param {*} res
 */
function postNewComment(req, res) {
  return res.send('postNewComment');
}

module.exports = {
  getCommentsFromPost,
  getCommentsFromUser,
  patchComment,
  postNewComment
};
