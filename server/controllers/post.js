const mongooseHelpers = require('../helpers/mongoose');
const { verifyPostsFromUser } = require('../services/request-helpers/request-helpers');
const Post = require('../model/post');
const User = require('../model/user');
const Comment = require('../model/comment');

// /////// public methods //////////////

/**
 * Retorna los últimos post. Si se le pasa la cantidad con el /cantidad, devolverá dicha cantidad
 * de posts, sino devuelve 10.
 * @param {*} req
 * @param {*} res
 */
async function getPosts(req, res) {
  try {
    let firstParam = req.params[0];
    if (firstParam) [firstParam] = firstParam.split('/');
    const amount = parseInt(firstParam || 10, 10);

    const posts = await Post.find()
      .select('createdAt message title _id')
      .limit(amount);

    res.send(posts);
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

    res.send(userPopulated.posts);
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

  const { title, message } = req.body;

  try {
    if (!postId) {
      return res.status(409).send({
        errors: [
          {
            title: 'Id Erroneo',
            description: 'El id del post debe ser enviado'
          }
        ]
      });
    }

    if (!title || !message) {
      return res.status(422).send({
        errors: [
          {
            title: 'Falta Data !',
            description: 'Mínimamente el title o el message tienen que ser modificados.'
          }
        ]
      });
    }

    const isVerified = verifyPostsFromUser(postId, user);

    if (!isVerified) {
      return res.status(403).send({
        errors: [
          {
            title: 'Error de Permisos !',
            description: 'El post no le pertenece al usuario.'
          }
        ]
      });
    }

    const properties = {
      title,
      message
    };

    const post = await Post.findByIdAndUpdate(postId, { $set: properties }, { new: true }).select(
      'message createdAt title'
    );

    return res.send({ post });
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
  }
}

/**
 * Crea un nuevo Post
 * @param {*} req
 * @param {*} res
 */
async function postNewPost(req, res) {
  const { title, message } = req.body;

  const { user } = res.locals;

  if (!title || !message) {
    return res.status(422).send({
      errors: [
        {
          title: 'Falta Data !',
          description: 'title & message son requeridos.'
        }
      ]
    });
  }

  const post = new Post({
    title,
    message,
    user
  });

  try {
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
      createdAt: post.createdAt
    };

    return res.send({
      post: parsedPost
    });
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
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

    if (!isVerified) {
      return res.status(403).send({
        errors: [
          {
            title: 'Error de Permisos !',
            description: 'El post no le pertenece al usuario.'
          }
        ]
      });
    }
    await Comment.deleteMany({ post: postId });

    const respDeletePost = await Post.findByIdAndDelete(postId);

    const query = { _id: user.id };
    const docUpdateUser = {
      $pull: { posts: postId }
    };

    await User.updateOne(query, docUpdateUser);

    res.send({ deletedPost: respDeletePost });
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
  }
}

module.exports = {
  getPosts,
  getPostsFromUser,
  patchPost,
  postNewPost,
  deletePost
};
