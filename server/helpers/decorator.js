const moment = require('moment');

/**
 * Retorna los posts para que sean manejados por el frontend
 * @param {any[]} postsFromServer
 */
function decoratePostsDetailed(postsFromServer) {
  const posts = postsFromServer.map(post => ({
    id: post.id,
    title: post.title,
    image: post.image,
    autor: {
      id: post.user.id,
      username: post.user.username
    },
    lastMsgAutor: {
      id: post.comments && post.comments[0] ? post.comments[0].user.id : null,
      username: post.comments && post.comments[0] ? post.comments[0].user.username : null
    }
  }));
  return posts;
}

const decorateGetCommentsFromUser = commentsFromUser =>
  commentsFromUser.map(comment => ({
    id: comment.id,
    message: comment.message,
    post: comment.post._id.toHexString(),
    updatedAt: moment(comment.updatedAt).format('DD/MM/YYYY, h:mm a')
  }));

const decorateGetCommentsFromPost = commentsFromPost =>
  commentsFromPost.map(comment => ({
    id: comment.id,
    message: comment.message,
    autor: {
      id: comment.user.id,
      username: comment.user.username
    },
    updatedAt: moment(comment.updatedAt).format('DD/MM/YYYY, h:mm a')
  }));

/**
 * Retorna los comments para que sean manejados por el frontend
 * @param {any[]} commentsFromServer
 * @param {'user' | 'post'} from
 */
function decorateGetComments(commentsFromServer, from) {
  switch (from) {
    case 'user':
      return decorateGetCommentsFromUser(commentsFromServer);
    case 'post':
      return decorateGetCommentsFromPost(commentsFromServer);
    default:
      throw new Error('Tipo tiene que ser "post" o "usuario"');
  }
}

module.exports = {
  decorateGetComments,
  decoratePostsDetailed
};
