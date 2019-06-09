const mongoose = require('mongoose');

const { Schema } = mongoose;

const searchSchema = new Schema({
  title: {
    type: String,
    max: [64, 'Too long, max is 64 characters']
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  filters: [{ type: Schema.Types.ObjectId, ref: 'Filter' }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Search', searchSchema);
