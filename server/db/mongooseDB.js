const mongoose = require('mongoose');
const config = require('./../config/config');
const { isTest } = require('../services/enviroment');
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

/**
 * Se conecta a la base de datos
 */
function connectToDB() {
  mongoose
    .connect(config.DB_URL, {
      useNewUrlParser: true
    })
    .then(() => {
      console.log(`mongoose connected to: ${config.DB_URL}`);
      // refreshDB();
      configMongoose();
    });
}

/**
 * Se conecta a la base de datos corriendo la app en modo test
 */
function connectToDBTestMode() {
  if (!isTest()) throw new Error('Se ejecuto connectToDBTestMode, sin estar en modo test');

  before(done => {
    mongoose
      .connect(config.DB_URL, {
        useNewUrlParser: true
      })
      .then(() => {
        console.log(`mongoose connected to: ${config.DB_URL}`);
        // refreshDB();
        configMongoose();
        done();
      });
  });
}

module.exports = {
  connectToDB,
  connectToDBTestMode
};
