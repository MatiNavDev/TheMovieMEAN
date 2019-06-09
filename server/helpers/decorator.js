const moment = require('moment');

/**
 * Retorna los posts para que sean manejados por el frontend
 * @param {any[]} postsFromServer
 */
function decorateGetPostsOrCommentDetailed(postsFromServer) {
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

/**
 * Retorna los comments para que sean manejados por el frontend
 * @param {any[]} commentsFromServer
 */
function decorateGetComments(commentsFromServer) {
  const comments = commentsFromServer.map(comment => ({
    id: comment.id,
    message: comment.message,
    autor: {
      id: comment.user.id,
      username: comment.user.username
    },
    updatedAt: moment(comment.updatedAt).format('DD/MM/YYYY, h:mm a')
  }));
  return comments;
}

module.exports = {
  decorateGetComments,
  decorateGetPostsOrCommentDetailed
};
