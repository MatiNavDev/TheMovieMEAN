/*
 * Retorna si el ambiente es produccion
 */
function isProd() {
  return process.env.NODE_ENV === 'prod';
}

/**
 * Retorna si el ambiente es produccion
 */
function isTest() {
  return process.env.NODE_ENV === 'test';
}

module.exports = {
  isProd,
  isTest
};
