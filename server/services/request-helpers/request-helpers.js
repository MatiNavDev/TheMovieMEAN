/**
 * Devuelve el objecto haciendo el patch en sus propiedades si es que las tiene
 * @param {*} properties
 * @param {*} object
 */
function patchObject(properties, object) {
  const keys = Object.keys(properties);

  keys.forEach(k => {
    if (properties[k] && object[k]) {
      object[k] = properties[k];
    }
  });

  return object;
}

/**
 * Verifica si un post pertenece a un usuario
 * @param {*} post
 * @param {*} user
 */
function verifyPostsFromUser(postId, user) {
  // traer todos los posts id del user
  // verificar si ese array incluye el post id

  if (!postId || !user) return false;

  return user.posts.find(post => post._id.toString() === postId) !== undefined;
}

/**
 * Verifica si un comment le pertenece al usuario
 * @param {*} commentId
 * @param {*} user
 */
function verifyCommentFromUser(commentId, user) {
  if (!user || !commentId) return false;

  return user.comments.find(comment => comment._id.toString() === commentId) !== undefined;
}

module.exports = {
  patchObject,
  verifyPostsFromUser,
  verifyCommentFromUser
};
