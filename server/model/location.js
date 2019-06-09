const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = new Schema({
  lat: {
    type: Number,
    required: 'Latitude is required'
  },
  long: {
    type: Number,
    required: 'Longitude is required'
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);
