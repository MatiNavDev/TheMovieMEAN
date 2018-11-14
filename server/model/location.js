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
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Location', locationSchema);
