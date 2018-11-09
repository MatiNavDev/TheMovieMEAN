if (process.env.NODE_ENV === 'production') { // pregunta si esta en modo produccion o en modo desarrollo
  module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./test');
} else {
  module.exports = require('./dev');
}


// TODO: Cuando se sube a prod borrar el dev y dejar solo el produ,
// donde voy a poner las variables de entorno
