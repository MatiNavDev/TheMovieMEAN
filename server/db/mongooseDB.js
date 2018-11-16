const mongoose = require('mongoose');
const config = require('./../config/config');
// const { refreshDB } = require('../db/testDB-setter');

/**
 * Configura Mongoose
 * @param {*} params
 */
function configMongoose() {
  // Esto muestra las querys que hace mongoose
  // mongoose.set('debug', (coll, method, query) => {
  //   console.log(coll, method, query);
  // });
  mongoose.set('useCreateIndex', true);
}

// ///// PUBLIC FUNCTIONS ///////

function connectToDB() {
  mongoose
    .connect(
      config.DB_URL,
      {
        useNewUrlParser: true
      }
    )
    .then(() => {
      console.log(`mongoose connected to: ${config.DB_URL}`);
      // refreshDB();
      configMongoose();
    });
}

module.exports = {
  connectToDB
};
