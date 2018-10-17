const config = require('./../config/config');
const mongoose = require('mongoose');

function connectToDB() {
  mongoose.connect(config.DB_URL, {
      useNewUrlParser: true
    })
    .then(() => {
      console.log('mongoose connected to: ' + config.DB_URL)
    })
  mongoose.set('useCreateIndex', true);
}

module.exports = {
  connectToDB
}
