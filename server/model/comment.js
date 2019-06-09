const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  message: {
    type: String,
    required: true,
    min: [4, 'Too short, min is 4 characters'],
    max: [4048, 'Too long, max is 4000 characters aprox.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' }
});

module.exports = mongoose.model('Comment', commentSchema);
