const User = require('../../model/user');

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
async function verifyPostsFromUser(postId, userId) {
  // traer todos los posts id del user
  // verificar si ese array incluye el post id

  const foundUser = await User.findById(userId)
    .populate('posts', '_id')
    .exec();

  return foundUser.posts.find(post => post.id === postId) !== undefined;
}

module.exports = {
  patchObject,
  verifyPostsFromUser
};
