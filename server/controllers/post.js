const mongooseHelper = require('../helpers/mongoose');
const Post = require('../model/post');

/**
 * Verifica si un post pertenece a un usuario
 * @param {*} post 
 * @param {*} user 
 */
function verifyCommentFromUser(post, user) {
    
  return true;
}




















///////// public methods //////////////

/**
 * Maneja el getPosts generico
 * @param {*} req 
 * @param {*} res 
 */
function getPosts(req, res) {

  const params = req.params[0]

  if (!params) {
    return res.send("getPosts")
  }

  const paramsParsed = req.params[0].split('/');

  return res.send(JSON.stringify(paramsParsed, undefined, 2));
}



/**
 * Retorna los últimos post del user
 * @param {*} req 
 * @param {*} res 
 */
function getPostsFromUser(req, res) {

    const params = req.params[0]

    if (!params) {
      return res.send("getPostsFromUser")
    }
  
    const paramsParsed = req.params[0].split('/');
  
    return res.send(JSON.stringify(paramsParsed, undefined, 2));
}


/**
 * Modifica un post
 * @param {*} req 
 * @param {*} res 
 */
function patchPost(req, res) {
    
  return res.send('patchPost');  

}


/**
 * Crea un nuevo comentario
 * @param {*} req 
 * @param {*} res 
 */
function postNewPost(req, res) {
    
  return res.send('postNewPost');  

}







module.exports = {
  getPosts,
  getPostsFromUser,
  patchPost,
  postNewPost
}