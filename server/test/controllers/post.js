const expect = require('expect');
const request = require('supertest');

const { app } = require('../../index');
const { makeToken } = require('../../services/token/token');
const User = require('../../model/user');
const Post = require('../../model/post');
const Comment = require('../../model/comment');
const { refreshDB } = require('../../db/testDB-setter');
const ErrorText = require('../../services/text/error');
const { checkIfError, assertNoAuthenticated, assertSomeError } = require('../assertion');

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

describe('POST TEST: /api/v1/posts', () => {
  cleanDB();

  describe('POST /', () => {
    it('should throw 401 with user no authenticated', done => {
      assertNoAuthenticated('/api/v1/posts/', falsyToken, done, 'post');
    });

    it('should throw 422 with missing data', done => {
      User.findOne()
        .then(user => {
          const token = makeToken(user);
          const route = '/api/v1/posts';
          const error = {
            title: ErrorText.NO_DATA,
            description: ErrorText.NO_MESSAGE_TITLE
          };

          assertSomeError(route, null, token, done, error, 422, 'post');
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
              const { post: postReceived } = res.body.result;
              expect(postReceived).toHaveProperty('title', post.title);
              expect(postReceived).toHaveProperty('message', post.message);
              expect(postReceived).toHaveProperty('_id');
              expect(postReceived).toHaveProperty('createdAt');
            })
            .end((err, res) => {
              if (err) return done(err);
              const { post: postFromServer } = res.body.result;

              Post.findById(postFromServer._id)
                .then(foundPost => {
                  expect(foundPost).toBeTruthy();
                  expect(foundPost).toHaveProperty('title', post.title);
                  expect(foundPost).toHaveProperty('message', post.message);

                  return done();
                })
                .catch(e => done(e));
            });
        })
        .catch(e => done(e));
    });
  });

  describe('PATCH /:id', () => {
    it('should modify a post correctly', done => {
      User.findOne({
        'posts.0': {
          $exists: true
        }
      })
        .populate('posts', 'id')
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
              const { post } = res.body.result;
              expect(post).toMatchObject(params);
              Post.findById(post._id)
                .then(foundPost => {
                  expect(foundPost).toBeTruthy();
                  expect(foundPost).toMatchObject(params);
                })
                .catch(e => done(e));
            })
            .end(err => checkIfError(err, done));
        })
        .catch(e => done(e));
    });

    it('should throw 403 with permission error', done => {
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

          const route = `/api/v1/posts/${userWithPost.posts[0].id}`;
          const error = {
            title: ErrorText.WRONG_PERMISSIONS,
            description: ErrorText.POST_NOT_FROM_USER
          };

          assertSomeError(route, params, tokenFromOtherUser, done, error, 403, 'patch');
        });
    });

    it('should throw 403 with wrong id', done => {
      User.findOne()
        .then(user => {
          const token = makeToken(user);
          const params = {
            title: 'Patch Test Title',
            message: 'Patch Test Message'
          };
          const route = '/api/v1/posts/41224d776a326fb40f000001';
          const error = {
            description: ErrorText.POST_NOT_FROM_USER,
            title: ErrorText.WRONG_PERMISSIONS
          };

          assertSomeError(route, params, token, done, error, 403, 'patch');
        })
        .catch(e => done(e));
    });

    it('should throw 422 with missing data', done => {
      User.findOne({
        'posts.0': {
          $exists: true
        }
      })
        .populate('posts', 'id')
        .then(user => {
          const token = makeToken(user);
          const params = {
            title: 'Patch Test Title'
          };
          const route = `/api/v1/posts/${user.posts[0].id}`;
          const error = {
            title: ErrorText.NO_DATA,
            description: ErrorText.MIN_SEND_TIT_MSG
          };

          assertSomeError(route, params, token, done, error, 422, 'patch');
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
              const resp = res.body.result;
              expect(resp.length).toBe(1);
              resp.forEach(post => {
                expect(post).toHaveProperty('_id');
                expect(post).toHaveProperty('title');
                expect(post).toHaveProperty('message');
                expect(post).toHaveProperty('createdAt');
              });
            })
            .end(err => checkIfError(err, done));
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
              const response = res.body.result;
              if (posts.length > 10) {
                expect(response.length).toBe(10);
              } else {
                expect(response.length).toBe(posts.length);
              }
              response.forEach(post => {
                expect(post).toHaveProperty('_id');
                expect(post).toHaveProperty('title');
                expect(post).toHaveProperty('message');
                expect(post).toHaveProperty('createdAt');
              });
            })
            .end(err => checkIfError(err, done));
        })
        .catch(e => done(e));
    });

    it('should throw 401 with user no authenticated', done => {
      assertNoAuthenticated('/api/v1/posts', falsyToken, done, 'get');
    });
  });

  describe('DELETE /:postId', () => {
    it('#should delete a post, updating user and deleting comments related', done => {
      User.findOne({ 'posts.0': { $exists: true } })
        .populate({
          path: 'posts',
          select: 'id comments',
          options: {
            limit: 1
          },
          populate: {
            path: 'comments',
            select: 'id',
            populate: {
              path: 'user',
              select: 'id'
            }
          }
        })
        .then(user => {
          const token = makeToken(user);
          const [postRelatedToUser] = user.posts;
          const commentsRelatedToPost = postRelatedToUser.comments;
          request(app)
            .delete(`/api/v1/posts/${postRelatedToUser.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(res => {
              expect(res.body.result).toHaveProperty('deletedPost');
              const promises = [];
              promises.push(
                User.findOne({ posts: postRelatedToUser.id }),
                Post.findById(postRelatedToUser.id)
              );
              commentsRelatedToPost.forEach(comment => {
                promises.push(User.findOne({ comments: comment.id }));
                promises.push(Comment.findById(comment.id));
              });

              Promise.all(promises)
                .then(responses => {
                  responses.forEach(resp => {
                    expect(resp).toBeNull();
                  });
                })
                .catch(e => done(e));
            })
            .end(err => checkIfError(err, done));
        })
        .catch(e => done(e));
    });

    it('#should throw 403 with verification errors (wrong user)', done => {
      Promise.all([
        User.findOne({ 'posts.0': { $exists: false } }).exec(),
        User.findOne({ 'posts.0': { $exists: true } })
          .populate({
            path: 'posts',
            select: 'id',
            options: {
              limit: 1
            }
          })
          .exec()
      ])
        .then(users => {
          const [userWithoutPost, userWithPost] = users;

          const token = makeToken(userWithoutPost);
          const postId = userWithPost.posts[0].id;
          const route = `/api/v1/posts/${postId}`;
          const error = {
            title: ErrorText.WRONG_PERMISSIONS,
            description: ErrorText.POST_NOT_FROM_USER
          };

          assertSomeError(route, null, token, done, error, 403, 'delete');
        })
        .catch(e => done(e));
    });

    it('#should throw 403 with verification errors (post doesnt exist)', done => {
      User.findOne()
        .then(user => {
          const token = makeToken(user);

          const route = '/api/v1/posts/falopa';
          const error = {
            title: ErrorText.WRONG_PERMISSIONS,
            description: ErrorText.POST_NOT_FROM_USER
          };

          assertSomeError(route, null, token, done, error, 403, 'delete');
        })
        .catch(e => done(e));
    });

    it('#should throw 401 with user no authenticated', done => {
      assertNoAuthenticated('/api/v1/posts/123123', falsyToken, done, 'delete');
    });
  });
});
