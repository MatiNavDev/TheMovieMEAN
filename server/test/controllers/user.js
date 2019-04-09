const expect = require('expect');
const request = require('supertest');

const { app } = require('../../index');
const User = require('./../../model/user');
const { refreshDB } = require('../../db/testDB-setter');
const ErrorText = require('../../services/text/error');
const { checkIfError } = require('../assertion');
const { assertSomeError } = require('../assertion');

/**
 * Limpia toda la bd
 * @param {*} params
 */
function cleanDB() {
  beforeEach(done => {
    refreshDB()
      .then(() => {
        done();
      })
      .catch(e => {
        done(e);
      });
  });
}

describe('USER TEST: /api/v1/auth', () => {
  cleanDB();

  describe('POST /api/v1/auth/register', () => {
    it('#should register a new user correctly', done => {
      const user = {
        email: 'userTwo@userTwo.com',
        username: 'userTwo',
        password: 'userTwo',
        confirmPassword: 'userTwo'
      };

      request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .expect(200)
        .expect(res => {
          const { user: userReceived } = res.body.result;
          expect(userReceived).toHaveProperty('email', user.email.toLowerCase());
          expect(userReceived).toHaveProperty('username', user.username);
        })
        .end(err => {
          if (err) done(err);

          User.findOne({
            email: user.email
          })
            .then(foundUser => {
              expect(foundUser).toHaveProperty('username', user.username);
              expect(foundUser.hasSamePassword(user.password)).toBeTruthy();
              return done();
            })
            .catch(e => done(e));
        });
    });

    it('should throw 422 with undefined fields', done => {
      const userOne = {
        email: 'userOne@userOne.com',
        password: 'userOne1234'
      };
      const error = {
        title: ErrorText.NO_DATA,
        description: ErrorText.NO_REGISTER_FIELDS
      };
      const route = '/api/v1/auth/register';

      assertSomeError(route, userOne, 'no hay token', done, error, 422, 'post');
    });

    it('#should throw 422 with already email registered', done => {
      const userOne = {
        email: 'test@test.com',
        username: 'userOne',
        password: 'userOne1234',
        confirmPassword: 'userOne1234'
      };
      const route = '/api/v1/auth/register';
      const error = {
        title: ErrorText.EMAIL_ERROR,
        description: ErrorText.DUPLICATED_EMAIL
      };
      assertSomeError(route, userOne, 'no hay token', done, error, 422, 'post');
    });

    it('#should throw 422 with wrong password and confirmationPassword', done => {
      const userOne = {
        email: 'userTwo1@userTwo1.com',
        username: 'userTwo',
        password: 'userTwoasdada',
        confirmPassword: 'userTwo'
      };
      const route = '/api/v1/auth/register';
      const error = {
        title: ErrorText.PASS_ERROR,
        description: ErrorText.WRONG_CONFIRMATION_PASS
      };
      assertSomeError(route, userOne, 'no hay token', done, error, 422, 'post');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('#should authenticate correctly to an user', done => {
      const userOne = {
        email: 'test@test.com',
        password: 'testtest'
      };

      request(app)
        .post('/api/v1/auth/login')
        .send(userOne)
        .expect(200)
        .expect(res => {
          expect(typeof res.body.result.token).toBe('string');
          expect(res.body.result.user).toHaveProperty('email', 'test@test.com');
        })
        .end(err => checkIfError(err, done));
    });

    it('#should throw 422 with no user', done => {
      const userOne = {
        email: 'userone@useronee.com',
        password: 'userOne'
      };
      const route = '/api/v1/auth/login';
      const error = {
        title: ErrorText.WRONG_USER_PASS,
        description: ErrorText.NO_EXISTS_USER_PASS
      };
      assertSomeError(route, userOne, 'no hay token', done, error, 422, 'post');
    });

    it('#should throw 422 with different password', done => {
      const userOne = {
        email: 'userone@userone.com',
        password: 'userOneee'
      };
      const route = '/api/v1/auth/login';
      const error = {
        title: ErrorText.WRONG_USER_PASS,
        description: ErrorText.NO_EXISTS_USER_PASS
      };
      assertSomeError(route, userOne, 'no hay token', done, error, 422, 'post');
    });
  });
});
