const request = require('supertest');
const expect = require('expect');
const { isFunction, isNumber, isObject, isString } = require('lodash');

const { app } = require('../index');
const { wrongCallToFunction } = require('../services/logger');
const ErrorText = require('../services/text/error');

const requestFunctions = {
  get: request(app).get,
  post: request(app).post,
  delete: request(app).delete,
  put: request(app).put,
  patch: request(app).patch
};

/**
 * Chequea si ocurrio un error en el test
 * @param {*} err
 * @param {*} done
 */
function checkIfError(err, done) {
  if (err) return done(err);

  return done();
}

/**
 * Realiza el assert sobre un error
 * @param {String} route
 * @param {*} param
 * @param {String} token
 * @param {*} done
 * @param {*} error
 * @param {Number} statusCode
 * @param {'get' | 'delete' | 'post' | 'patch' | 'put'} requestType
 */
function assertSomeError(route, param, token, done, error, statusCode, requestType) {
  if (!isFunction(done) || !isNumber(statusCode) || !isObject(error) || !isString(route))
    // el param a veces es null
    throw wrongCallToFunction('assertSomeError', [route, done, error, statusCode]);

  requestFunctions[requestType](route)
    .set('Authorization', `Bearer ${token}`)
    .send(param)
    .expect(statusCode)
    .expect(res => {
      expect(res.body.errors).toContainEqual(error);
    })
    .end(err => checkIfError(err, done));
}

/**
 * Realiza el assert sobre si esta autenticado
 * @param {String} route
 * @param {String} token
 * @param {*} done
 * @param {'get' | 'delete' | 'post' | 'patch' | 'put'} requestType
 */
function assertNoAuthenticated(route, token, done, requestType) {
  if (!isFunction(done) || !isString(token) || !isString(route))
    // el param a veces es null
    throw wrongCallToFunction('assertSomeError', [route, done, token]);

  const authenticatedError = {
    title: ErrorText.NO_AUTHORIZED,
    description: ErrorText.INVALID_TOKEN
  };

  assertSomeError(route, null, token, done, authenticatedError, 401, requestType);
}

/**
 * Realiza el assert sobre ningun dato encontrada
 * @param {*} route
 * @param {*} param
 * @param {*} done
 */
function assertNoData(route, param, done) {
  if (!isFunction(done) || !isString(route))
    // el param a veces es null
    throw wrongCallToFunction('assertNoData', [route, done]);

  request(app)
    .get(route)
    .expect(204)
    .expect(res => {
      expect(res.body.statusCode).toBeUndefined();
      expect(res.body.result).toBeUndefined();
    })
    .end(err => checkIfError(err, done));
}

module.exports = {
  assertSomeError,
  checkIfError,
  assertNoData,
  assertNoAuthenticated
};
