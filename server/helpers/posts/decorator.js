/**
 * Retorna los posts para que sean manejados por el frontend
 * @param {any[]} postsFromServer
 */
function decorateGetPosts(postsFromServer) {
  const posts = postsFromServer.map(post => ({
    id: post.id,
    title: post.title,
    image: post.image,
    autor: {
      id: post.user.id,
      username: post.user.username
    },
    lastMsgAutor: {
      id: post.comments[0] ? post.comments[0].user.id : null,
      username: post.comments[0] ? post.comments[0].user.username : null
    }
  }));
  return posts;
}

module.exports = {
  decorateGetPosts
};
