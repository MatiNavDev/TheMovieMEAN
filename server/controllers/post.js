const mongooseHelper = require('../helpers/mongoose');
const Post = require('../model/post');



















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








module.exports = {
  getPosts,
  getPostsFromUser
}