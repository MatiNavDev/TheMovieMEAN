const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: [64, 'Too long, max is 64 characters'],
  },
  message: {
    type: String,
    required: true,
    min: [4, 'Too short, min is 4 characters'],
    max: [4048, 'Too long, max is 4000 characters aprox.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});


module.exports = mongoose.model('Post', postSchema);
