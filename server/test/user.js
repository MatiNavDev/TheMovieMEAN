const expect = require('expect');
const request = require('supertest');

const { app } = require('../index');
const User = require('./../model/user');
const { refreshDB } = require('../db/testDB-setter');
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

describe('USER TEST: /api/v1/auth', function() {
  this.timeout(5000);
  cleanDB();

  describe('POST /authMiddleware', function() {
    this.timeout(5000);

    it('should response 401 with no token provided', function(done) {
      this.timeout(5000);
      request(app)
        .post('/api/v1/image-upload')
        .expect(401)
        .expect(res => {
          expect(res.body.errors).toBeTruthy();
          expect(res.body.errors).toContainEqual({
            title: 'No autorizado !',
            description: 'Token no enviado.'
          });
        })
        .end(err => {
          if (err) return done(err);

          return done();
        });
    });
  });

  describe('POST /api/v1/auth/register', function() {
    this.timeout(5000);

    it('#should register a new user correctly', function(done) {
      this.timeout(4000);

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
          expect(res.body.user).toHaveProperty('email', user.email.toLowerCase());
          expect(res.body.user).toHaveProperty('username', user.username);
        })
        .end(err => {
          expect(err).toBe(null);

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

    it('should throw 422 with undefined fields', function(done) {
      this.timeout(4000);

      const userOne = {
        email: 'userOne@userOne.com',
        password: 'userOne1234'
      };
      request(app)
        .post('/api/v1/auth/register')
        .send(userOne)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'Campos no enviados!',
            description: 'Usuario, Contraseña, Confirmacion Contraseña y Email son requeridos.'
          });
        })
        .end(err => {
          if (err) return done(err);

          User.find({})
            .then(users => {
              expect(users.length).toBe(2);
              return done();
            })
            .catch(e => done(e));
        });
    });

    it('#should throw 422 with already email registered', done => {
      this.timeout(4000);

      const userOne = {
        email: 'test@test.com',
        username: 'userOne',
        password: 'userOne1234',
        confirmPassword: 'userOne1234'
      };

      request(app)
        .post('/api/v1/auth/register')
        .send(userOne)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'Error con Email!',
            description: 'Email duplicado.'
          });
        })
        .end(err => {
          if (err) {
            return done(err);
          }

          User.find({})
            .then(users => {
              expect(users.length).toBe(2);
              return done();
            })
            .catch(e => done(e));
        });
    });

    it('#should throw 422 with wrong password and confirmationPassword', function(done) {
      this.timeout(4000);

      const userOne = {
        email: 'userTwo1@userTwo1.com',
        username: 'userTwo',
        password: 'userTwoasdada',
        confirmPassword: 'userTwo'
      };

      request(app)
        .post('/api/v1/auth/register')
        .send(userOne)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'Error con Contraseñas!',
            description: 'Las Contraseñas no coinciden.'
          });
        })
        .end(err => {
          if (err) return done(err);

          User.find()
            .then(users => {
              expect(users.length).toBe(2);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('POST /api/v1/auth/login', function() {
    this.timeout(4000);

    it('#should authenticate correctly to an user', function(done) {
      this.timeout(4000);

      const userOne = {
        email: 'test@test.com',
        password: 'testtest'
      };

      request(app)
        .post('/api/v1/auth/login')
        .send(userOne)
        .expect(200)
        .expect(res => {
          expect(typeof res.body.token).toBe('string');
          expect(res.body.user).toHaveProperty('email', 'test@test.com');
        })
        .end(err => {
          if (err) return done(err);

          return done();
        });
    });

    it('#should throw 422 with no user', done => {
      this.timeout(4000);

      const userOne = {
        email: 'userone@useronee.com',
        password: 'userOne'
      };

      request(app)
        .post('/api/v1/auth/login')
        .send(userOne)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'Error !',
            description: 'Usuario no encontrado.'
          });
        })
        .end(err => {
          if (err) return done(err);

          done();
        });
    });

    it('#should throw 422 with different password', done => {
      this.timeout(4000);

      const userOne = {
        email: 'userone@userone.com',
        password: 'userOneee'
      };

      request(app)
        .post('/api/v1/auth/login')
        .send(userOne)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'Error !',
            description: 'Usuario no encontrado.'
          });
        })
        .end(err => {
          if (err) return done(err);

          done();
        });
    });
  });
});
