const request = require('supertest');
const expect = require('expect');

const { refreshDB } = require('../db/testDB-setter');
const { app } = require('../index');
const User = require('../model/user');
const Post = require('../model/post');
const { makeToken } = require('../services/token/token');

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

const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmQzOGEyY2M1ZmU2NzNiMWE0ZDkyMDEiLCJ1c2VybmFtZSI6InVzZXJUd28iLCJpYXQiOjE1NDA2ODQ4NzMsImV4cCI6MTU0MDY4ODQ3M30.7fe4dBigiP1hl8W31jsH8Z31eyefbUZkyWRBoI8pl3E';

describe('COMMENT TEST: /api/v1/comments', function() {
  this.timeout(5000);

  cleanDB();

  describe('GET /user/*?', function() {
    this.timeout(10000);

    it('#should return 3 comments for user', function(done) {
      this.timeout(10000);
      User.findOne({
        'comments.3': { $exists: true }
      })
        .then(user => {
          if (!user) return done('No hay usuarios con mas de 3 comentarios, agregarlos');

          const token = makeToken(user);

          request(app)
            .get('/api/v1/comments/user/?amount=3')
            .set('Authorization', `Bearer ${token}`)
            .expect(res => {
              expect(res.body).toHaveProperty('comments');
              expect(res.body.comments.length).toBe(3);
              res.body.comments.forEach(comment => {
                expect(comment).toHaveProperty('message');
              });
            })
            .end(err => {
              if (err) return done(err);

              return done();
            });
        })
        .catch(e => done(e));
    });

    it('#should return default amount (10) user comments', function(done) {
      this.timeout(10000);
      User.findOne({
        'comments.9': { $exists: true }
      })
        .then(user => {
          if (!user) return done('No hay usuarios con mas de 10 comentarios, agregarlos');

          const token = makeToken(user);

          request(app)
            .get('/api/v1/comments/user/')
            .set('Authorization', `Bearer ${token}`)
            .expect(res => {
              expect(res.body).toHaveProperty('comments');
              expect(res.body.comments.length).toBe(10);
              res.body.comments.forEach(comment => {
                expect(comment).toHaveProperty('message');
              });
            })
            .end(err => {
              if (err) return done(err);

              return done();
            });
        })
        .catch(e => done(e));
    });

    it('#should throw 401 with user no authenticated', function(done) {
      this.timeout(10000);

      request(app)
        .get('/api/v1/comments/user/')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401)
        .expect(res =>
          expect(res.body.errors).toContainEqual({
            title: 'No autorizado !',
            description: 'Token inválido.'
          })
        )
        .end(err => {
          if (err) return done(err);

          done();
        });
    });
  });

  describe('GET /:postId', function() {
    this.timeout(10000);

    it('#should return 3 post comments', done => {
      this.timeout(10000);

      Promise.all([
        Post.findOne({
          'comments.3': { $exists: true }
        }),
        User.findOne()
      ])
        .then(resp => {
          const [post, user] = resp;

          if (!post) return done('No hay posts con mas de 3 comentarios, agregarlos');

          const token = makeToken(user);

          request(app)
            .get(`/api/v1/comments/${post.id}/?amount=3`)
            .set('Authorization', `Bearer ${token}`)
            .expect(res => {
              expect(res.body).toHaveProperty('comments');
              expect(res.body.comments.length).toBe(3);
              res.body.comments.forEach(comment => {
                expect(comment).toHaveProperty('message');
              });
            })
            .end(err => {
              if (err) return done(err);

              return done();
            });
        })
        .catch(e => done(e));
    });
    it('#should return default amount (10) post comments', done => {
      this.timeout(10000);

      Promise.all([
        Post.findOne({
          'comments.9': { $exists: true }
        }),
        User.findOne()
      ])
        .then(resp => {
          const [post, user] = resp;

          if (!post) return done('No hay posts con mas de 10 comentarios, agregarlos');

          const token = makeToken(user);

          request(app)
            .get(`/api/v1/comments/${post.id}/`)
            .set('Authorization', `Bearer ${token}`)
            .expect(res => {
              expect(res.body).toHaveProperty('comments');
              expect(res.body.comments.length).toBe(10);
              res.body.comments.forEach(comment => {
                expect(comment).toHaveProperty('message');
              });
            })
            .end(err => {
              if (err) return done(err);

              return done();
            });
        })
        .catch(e => done(e));
    });
    it('#should throw 401 with user no authenticated', done => {
      this.timeout(10000);
      Post.findOne()
        .then(post => {
          request(app)
            .get(`/api/v1/comments/${post.id}/`)
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(401)
            .expect(res =>
              expect(res.body.errors).toContainEqual({
                title: 'No autorizado !',
                description: 'Token inválido.'
              })
            )
            .end(err => {
              if (err) return done(err);

              done();
            });
        })
        .catch(e => done(e));
    });
  });

  describe('DELETE /:commentId', function(done) {
    this.timeout(10000);
    it('#should delete a comment, updating user and post related', function(done) {
      this.timeout(10000);
      done();
    });
    it('#should throw 404 with verification errors (wrong user)', function(done) {
      this.timeout(10000);
      done();
    });
    it('#should throw 404 with verification errors (comment doesnt exist)', function(done) {
      this.timeout(10000);
      done();
    });
    it('#should throw 401 with user no authenticated', function(done) {
      this.timeout(10000);
      done();
    });
  });
});
