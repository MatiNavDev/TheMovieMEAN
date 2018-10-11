const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters']
    },
    email: {
        type: String,
        required: 'Email is required',
        lowercase: true,
        unique: true,
        required: 'Email is required',
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: 'Password is required',
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 128 characters']
    },
    image: { 
        type: String,
     },
    location: {type: Schema.Types.ObjectId, ref: 'Location'},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}], // posts creados por el usuario
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}], // comentarios realizados en los distintos posts
    filters: [{type: Schema.Types.ObjectId, ref: 'Filter'}], 
    searches: [{type: Schema.Types.ObjectId, ref: 'Search'}], 
});


/**
 * Genera el hash y guarda dicho hash en la base de datos previo guardado del usuario
 */
userSchema.pre('save', function(next) {
    // Metodo propio del schema => this corresponde al userSchema
    const user = this

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash
            next()
        });
    });
})


/**
 *  Verifica si la password 
 * recibida coincide con la password hasheada por el usuario.
 */
userSchema.methods.hasSamePassword = function (requestedPassword){
    // Metodo propio del schema (por eso this.password)
    return bcrypt.compareSync(requestedPassword, this.password)
}


module.exports = mongoose.model('User', userSchema)