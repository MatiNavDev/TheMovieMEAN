/**
 * Retorna los comments para que sean manejados por el frontend
 * @param {any[]} commentsFromServer
 */
function decorateGetComments(commentsFromServer) {
  const posts = commentsFromServer.map(comment => ({
    id: comment.id,
    message: comment.message,
    autor: {
      id: comment.user.id,
      username: comment.user.username
    }
  }));
  return posts;
}

module.exports = {
  decorateGetComments
};
