const mongooseHelpers = require('../helpers/mongoose');
const Comment = require('../model/comment');


/**
 * Verifica si un comentrio pertenece a un usuario
 * @param {*} comment 
 * @param {*} user 
 */
function verifyCommentFromUser(comment, user) {
    
    return true;
}
















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


/**
 * Modifica un comentario
 * @param {*} req 
 * @param {*} res 
 */
function patchComment(req, res) {
    
    return res.send('patchComment');
}


/**
 * Crea un nuevo comentario
 * @param {*} req 
 * @param {*} res 
 */
function postNewComment(req, res) {

    return res.send('postNewComment');  
}









module.exports = {
    getCommentsFromPost,
    getCommentsFromUser,
    patchComment,
    postNewComment
}