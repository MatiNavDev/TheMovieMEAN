const mongooseHelpers = require('../helpers/mongoose');
const Comment = require('../model/comment');



















///////// PUBLIC FUNCTIONS //////////////


/**
 * Retorna los comentarios respecto a un post
 * @param {*} req 
 * @param {*} res 
 */
function getCommentsFromPost(req, res) {
    

  
    return res.send(JSON.stringify(req.params, undefined, 2));
}



/**
 * Retorna los comentarios respecto a un usuario
 * @param {*} req 
 * @param {*} res 
 */
function getCommentsFromUser(req, res){

    const params = req.params

  
    return res.send(JSON.stringify(req.params, undefined, 2));
}









module.exports = {
    getCommentsFromPost,
    getCommentsFromUser
}