const mongooseHelpers = require('../helpers/mongoose');
const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');
const { verifyCommentFromUser } = require('../services/request-helpers/request-helpers');

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
        limit: amount,
        sort: { createdAt: 1 }
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

    return res.send({ comments: foundPost.comments });
  } catch (e) {
    return res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

    return res.send({ comments: foundUser.comments });
  } catch (e) {
    return res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

    if (!commentId)
      return res.status(400).send({
        errors: [
          {
            title: 'Id Erroneo',
            description: 'El id del comentario debe ser enviado'
          }
        ]
      });

    if (!message)
      return res.status(422).send({
        errors: [
          {
            title: 'Falta Data !',
            description: 'Mínimamente el message tiene que ser modificado.'
          }
        ]
      });

    const isVerified = verifyCommentFromUser(commentId, user);

    if (!isVerified) {
      return res.status(403).send({
        errors: [
          {
            title: 'Error de Permisos !',
            description: 'El comment no le pertenece al usuario.'
          }
        ]
      });
    }

    const properties = {
      message
    };
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: properties },
      { fields: { id: 1, message: 1, createdAt: 1 } }
    )
      .select('message createdAt')
      .exec();

    return res.send({ comment });
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

    if (!message)
      return res.status(422).send({
        errors: [
          {
            title: 'Falta Data !',
            description: 'El campo message es requerido.'
          }
        ]
      });

    const post = await Post.findById(postId);

    if (!post)
      return res.status(409).send({
        errors: [
          {
            title: 'Id Erroneo',
            description: 'El id no corresponde a ningún post'
          }
        ]
      });

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

    return res.send({ comment: commentParsed });
  } catch (e) {
    return res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

  const { commentId } = req.params;
  const { user } = res.locals;

  const isVerified = verifyCommentFromUser(commentId, user);

  if (!isVerified) {
    return res.status(403).send({
      errors: [
        {
          title: 'Error de Permisos !',
          description: 'El comentario no le pertenece al usuario.'
        }
      ]
    });
  }

  const respDeletedComment = await Comment.findByIdAndDelete(commentId);

  const queryPost = { comments: commentId };
  const docUpdatePost = { $pull: { comments: commentId } };

  await Post.updateOne(queryPost, docUpdatePost);

  const queryUser = { _id: user.id };
  const docUpdateUser = { $pull: { comments: commentId } };
  await User.updateOne(queryUser, docUpdateUser);

  res.send({ deletedComment: respDeletedComment });
}

module.exports = {
  getCommentsFromPost,
  getCommentsFromUser,
  patchComment,
  postNewComment,
  deleteComment
};
