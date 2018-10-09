const mongoose = require('mongoose')
const Schema = mongoose.Schema

const searchSchema = new Schema({
    title: { 
        type: String, 
        max: [64, 'Too long, max is 64 characters']
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    filters: [{type: Schema.Types.ObjectId, ref: 'Filter'}],
});  

module.exports = mongoose.model('Search', searchSchema)