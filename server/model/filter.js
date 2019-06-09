const mongoose = require('mongoose');

const { Schema } = mongoose;

const filterSchema = new Schema({
  category: {
    type: String,
    required: true,
    max: [64, 'Too long, max is 64 characters']
  },
  value: {
    type: String,
    required: true,
    max: [128, 'Too long, max is 64 characters']
  },
  search: { type: Schema.Types.ObjectId, ref: 'Search' },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Filter', filterSchema);

/* * : Si bien un filtro puede ser usado en varias busquedas (=> busqueda{} tendria que ser busquedas[]),
yo no voy a utilizar eso sino que simplemente voy a asociar que una busqueda puede estar formada por varios 
filtros, y es por eso que el atributo search es un objeto y no un array. */
