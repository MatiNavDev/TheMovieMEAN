const mongooseHelpers = require('../helpers/mongoose');
const requestHelperSrvc = require('../services/request-helpers/request-helpers');
const Post = require('../model/post');
const User = require('../model/user');

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

  const { id } = req.params;

  const { title, message } = req.body;

  const properties = {
    title,
    message
  };

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).send({
        errors: [
          {
            title: 'Id Erroneo',
            description: 'El id no corresponde a ningún post'
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

    const isVerified = await requestHelperSrvc.verifyPostsFromUser(post.id, user.id);

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

    const patchedPost = requestHelperSrvc.patchObject(properties, post);

    post.set(patchedPost);
    await post.save();

    return res.send(post);
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

    const parsedPost = {
      _id: post._id,
      title: post.title,
      message: post.message,
      createdAt: post.createdAt
    };

    await User.updateOne(query, docUpdate);

    return res.send({
      post: parsedPost
    });
  } catch (e) {
    res.status(422).send(mongooseHelpers.normalizeErrors(e.errors));
  }
}

module.exports = {
  getPosts,
  getPostsFromUser,
  patchPost,
  postNewPost
};
