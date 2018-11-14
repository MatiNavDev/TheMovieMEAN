const expect = require('expect');
const request = require('supertest');

const { app } = require('../index');
const { makeToken } = require('../services/token/token');
const User = require('../model/user');
const Post = require('../model/post');
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

const falsyToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmQzOGEyY2M1ZmU2NzNiMWE0ZDkyMDEiLCJ1c2VybmFtZSI6InVzZXJUd28iLCJpYXQiOjE1NDA2ODQ4NzMsImV4cCI6MTU0MDY4ODQ3M30.7fe4dBigiP1hl8W31jsH8Z31eyefbUZkyWRBoI8pl3E';

describe('POST TEST: /api/v1/posts', function() {
  this.timeout(4000);
  cleanDB();

  describe('POST /', () => {
    it('should throw 401 with user no authenticated', done => {
      request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${falsyToken}`)
        .expect(401)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'No autorizado !',
            description: 'Token inválido.'
          });
        })
        .end(err => {
          if (err) return done(err);

          return done();
        });
    });

    it('should throw 422 with missing data', done => {
      User.findOne()
        .then(user => {
          const token = makeToken(user);

          request(app)
            .post('/api/v1/posts')
            .set('Authorization', `Bearer ${token}`)
            .expect(422)
            .expect(res => {
              expect(res.body.errors).toContainEqual({
                title: 'Falta Data !',
                description: 'title & message son requeridos.'
              });
            })
            .end(err => {
              if (err) return done(err);

              return done();
            });
        })
        .catch(e => done(e));
    });

    it('should save correctly the post', done => {
      User.findOne()
        .then(user => {
          const post = {
            title: 'lolo',
            message: 'lili'
          };

          const token = makeToken(user);

          request(app)
            .post('/api/v1/posts')
            .set('Authorization', `Bearer ${token}`)
            .send(post)
            .expect(200)
            .expect(res => {
              expect(res.body.post).toHaveProperty('title', post.title);
              expect(res.body.post).toHaveProperty('message', post.message);
              expect(res.body.post).toHaveProperty('_id');
              expect(res.body.post).toHaveProperty('createdAt');
            })
            .end((err, res) => {
              if (err) return done(err);

              Post.findById(res.body.post._id)
                .then(foundPost => {
                  expect(foundPost).toBeTruthy();
                  expect(res.body.post).toHaveProperty('title', post.title);
                  expect(res.body.post).toHaveProperty('message', post.message);

                  return done();
                })
                .catch(e => done(e));
            });
        })
        .catch(e => done(e));
    });
  });

  describe('PATCH /:id', function() {
    this.timeout(4000);

    it('should modify a post correctly', function(done) {
      this.timeout(4000);

      User.findOne({
        'posts.0': {
          $exists: true
        }
      })
        .populate('posts', '_id')
        .then(user => {
          const params = {
            title: 'Patch Test Title',
            message: 'Patch Test Message'
          };

          const token = makeToken(user);

          request(app)
            .patch(`/api/v1/posts/${user.posts[0].id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(params)
            .expect(200)
            .expect(res => {
              expect(res.body).toMatchObject(params);
            })
            .end((err, res) => {
              if (err) return expect(err).toBe(null);

              Post.findById(res.body._id)
                .then(foundPost => {
                  expect(foundPost).toBeTruthy();
                  expect(foundPost).toMatchObject(params);
                  return done();
                })
                .catch(e => done(e));
            });
        });
    });

    it('should throw 403 with permission error', function(done) {
      this.timeout(4000);
      User.find({})
        .populate('posts', '_id')
        .then(users => {
          const userWithPost = users.find(user => user.posts[0]);
          const otherUser = users.find(user => user.id !== userWithPost.id);
          const tokenFromOtherUser = makeToken(otherUser);
          const params = {
            title: 'Patch Test Title',
            message: 'Patch Test Message'
          };

          request(app)
            .patch(`/api/v1/posts/${userWithPost.posts[0].id}`)
            .set('Authorization', `Bearer ${tokenFromOtherUser}`)
            .send(params)
            .expect(403)
            .expect(res => {
              expect(res.body.errors).toContainEqual({
                title: 'Error de Permisos !',
                description: 'El post no le pertenece al usuario.'
              });
            })
            .end(err => {
              if (err) return done(err);
              return done();
            });
        });
    });

    it('should throw 400 with wrong id', function(done) {
      this.timeout(4000);

      User.findOne()
        .then(user => {
          const token = makeToken(user);
          const params = {
            title: 'Patch Test Title',
            message: 'Patch Test Message'
          };

          request(app)
            .patch('/api/v1/posts/41224d776a326fb40f000001')
            .set('Authorization', `Bearer ${token}`)
            .send(params)
            .expect(400)
            .expect(res => {
              expect(res.body.errors).toContainEqual({
                title: 'Id Erroneo',
                description: 'El id no corresponde a ningún post'
              });
            })
            .end(err => {
              if (err) return done(err);

              done();
            });
        })
        .catch(e => done(e));
    });

    it('should throw 422 with missing data', function(done) {
      this.timeout(4000);
      User.findOne({
        'posts.0': {
          $exists: true
        }
      })
        .populate('posts', '_id')
        .then(user => {
          const token = makeToken(user);
          const params = {
            title: 'Patch Test Title'
          };

          request(app)
            .patch(`/api/v1/posts/${user.posts[0]._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(params)
            .expect(422)
            .expect(res => {
              expect(res.body.errors).toContainEqual({
                title: 'Falta Data !',
                description: 'Mínimamente el title o el message tienen que ser modificados.'
              });
            })
            .end(err => {
              if (err) return done(err);
              done();
            });
        })
        .catch(e => done(e));
    });
  });

  describe('GET /', () => {
    it('should get 1 posts', done => {
      User.findOne()
        .then(user => {
          const token = makeToken(user);
          const amount = 1;
          request(app)
            .get(`/api/v1/posts/${amount}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(res => {
              expect(res.body.length).toBe(1);
              res.body.forEach(post => {
                expect(post).toHaveProperty('_id');
                expect(post).toHaveProperty('title');
                expect(post).toHaveProperty('message');
                expect(post).toHaveProperty('createdAt');
              });
            })
            .end(err => {
              if (err) return done(err);

              done();
            });
        })
        .catch(e => done(e));
    });

    it('should get all posts or 10 like max', done => {
      Promise.all([User.findOne(), Post.find()])
        .then(resp => {
          const [user, posts] = resp;
          const token = makeToken(user);

          request(app)
            .get('/api/v1/posts')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(res => {
              if (posts.length > 10) {
                expect(res.body.length).toBe(10);
              } else {
                expect(res.body.length).toBe(posts.length);
              }
              res.body.forEach(post => {
                expect(post).toHaveProperty('_id');
                expect(post).toHaveProperty('title');
                expect(post).toHaveProperty('message');
                expect(post).toHaveProperty('createdAt');
              });
            })
            .end(err => {
              if (err) return done(err);

              done();
            });
        })
        .catch(e => done(e));
    });

    it('should throw 401 with user no authenticated', done => {
      request(app)
        .get('/api/v1/posts')
        .set('Authorization', `Bearer ${falsyToken}`)
        .expect(401)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'No autorizado !',
            description: 'Token inválido.'
          });
        })
        .end(err => {
          if (err) return done(err);

          return done();
        });
    });
  });

  describe('DELETE /:postId', function(done) {
    this.timeout(10000);
    it('#should delete a post, updating user and deleting comments related', function(done) {
      this.timeout(10000);
      done();
    });
    it('#should throw 404 with verification errors (wrong user)', function(done) {
      this.timeout(10000);
      done();
    });
    it('#should throw 404 with verification errors (post doesnt exist)', function(done) {
      this.timeout(10000);
      done();
    });
    it('#should throw 401 with user no authenticated', function(done) {
      this.timeout(10000);
      done();
    });
  });
});
