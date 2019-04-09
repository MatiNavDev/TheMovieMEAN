const request = require('supertest');
const expect = require('expect');

const { refreshDB, addSomeCommentsToPost } = require('../../db/testDB-setter');
const { app } = require('../../index');
const User = require('../../model/user');
const Post = require('../../model/post');
const Comment = require('../../model/comment');
const { makeToken } = require('../../services/token/token');
const ERROR = require('../../services/text/error');
const { checkIfError, assertSomeError, assertNoAuthenticated } = require('../assertion');

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

describe('COMMENT TEST: /api/v1/comments', () => {
  cleanDB();

  describe('GET /user/*?', () => {
    it('#should return 3 comments for user', done => {
      User.findOne({
        'posts.0': { $exists: true }
      })
        .populate({ path: 'posts', select: 'id comments' })
        .then(user => {
          if (!user) return done('No hay usuarios con mas de 3 comentarios, agregarlos');

          const token = makeToken(user);

          request(app)
            .get('/api/v1/comments/user/?amount=3')
            .set('Authorization', `Bearer ${token}`)
            .expect(res => {
              const { comments } = res.body.result;
              expect(comments.length).toBe(3);
              comments.forEach(comment => {
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

    it('#should return default amount (10) user comments', done => {
      User.findOne({
        'posts.0': { $exists: true }
      })
        .populate({ path: 'posts', select: 'id comments' })
        .then(user => {
          if (!user) return done('No hay usuarios con mas de 10 comentarios, agregarlos');

          const token = makeToken(user);

          request(app)
            .get('/api/v1/comments/user/')
            .set('Authorization', `Bearer ${token}`)
            .expect(res => {
              const { comments } = res.body.result;
              expect(comments.length).toBe(10);
              comments.forEach(comment => {
                expect(comment).toHaveProperty('message');
              });
            })
            .end(err => {
              checkIfError(err, done);
            });
        })
        .catch(e => done(e));
    });

    it('#should throw 401 with user no authenticated', done => {
      assertNoAuthenticated('/api/v1/comments/user/', invalidToken, done, 'get');
    });
  });

  describe('GET /:postId', () => {
    it('#should return 3 post comments', done => {
      Post.findOne({
        'comments.0': { $exists: true }
      })
        .populate({ path: 'comments', select: 'id' })
        .populate({ path: 'user', select: 'id username' })
        .exec()
        .then(post => {
          addSomeCommentsToPost(post, post.user, 2)
            .then(() => {
              const token = makeToken(post.user);
              request(app)
                .get(`/api/v1/comments/${post.id}/?amount=3`)
                .set('Authorization', `Bearer ${token}`)
                .expect(res => {
                  console.log(post.comments.length);
                  const { result } = res.body;
                  expect(result).toHaveProperty('comments');
                  expect(result.comments.length).toBe(3);
                  result.comments.forEach(comment => {
                    expect(comment).toHaveProperty('message');
                  });
                })
                .end(err => {
                  checkIfError(err, done);
                });
            })
            .catch(e => done(e));
        })
        .catch(e => done(e));
    });
    it('#should return default amount (10) post comments', done => {
      Post.findOne({
        'comments.0': { $exists: true }
      })
        .populate({ path: 'comments', select: 'id' })
        .populate({ path: 'user', select: 'id username' })
        .exec()
        .then(post => {
          addSomeCommentsToPost(post, post.user, 14)
            .then(() => {
              const token = makeToken(post.user);

              request(app)
                .get(`/api/v1/comments/${post.id}/`)
                .set('Authorization', `Bearer ${token}`)
                .expect(res => {
                  const { result } = res.body;
                  expect(result).toHaveProperty('comments');
                  expect(result.comments.length).toBe(10);
                  result.comments.forEach(comment => {
                    expect(comment).toHaveProperty('message');
                  });
                })
                .end(err => {
                  checkIfError(err, done);
                });
            })
            .catch(e => done(e));
        })
        .catch(e => done(e));
    });
    it('#should throw 401 with user no authenticated', done => {
      Post.findOne()
        .then(post => {
          assertNoAuthenticated(`/api/v1/comments/${post.id}/`, invalidToken, done, 'get');
        })
        .catch(e => done(e));
    });
  });

  describe('DELETE /:commentId', () => {
    it('#should delete a comment, updating user and post related', done => {
      /**
       * Obtener un post con 2 o + comments,
       * enviar uno de esos para que se borre.
       * Chequear que la respuesta sea la que vendria con un borrado exitoso
       * Chequear que el user 'test' (que es el que tiene todo) despues no tenga ese comentario
       * chequear que el post no tenga ese comentario
       * obtener la lista de comentarios y chequear que no exista ese comentario
       */

      User.findOne({ 'posts.0': { $exists: true } })
        .populate({
          path: 'posts',
          select: 'comments',
          populate: {
            path: 'comments',
            select: 'id'
          }
        })
        .then(user => {
          const token = makeToken(user);
          request(app)
            .delete(`/api/v1/comments/${user.posts[0].comments[0].id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(res => {
              const { deletedComment } = res.body.result;
              expect(deletedComment._id).toBe(user.posts[0].comments[0].id);

              const assertionsPromises = [
                User.findById(user.id).populate({ path: 'comments', select: 'id' }),
                Post.findById(user.posts[0].id).populate({
                  path: 'comments',
                  select: 'id'
                }),
                Comment.find()
              ];
              Promise.all(assertionsPromises)
                .then(resp => {
                  const [
                    userWithDeletedComment,
                    postWithDeletedComment,
                    commentsWithDeletedComment
                  ] = resp;
                  const { id } = res.body.result.deletedComment;
                  const commentFromUserThatShouldBeUndefined = userWithDeletedComment.comments.find(
                    comment => comment.id === id
                  );
                  const commentFromPostThatShouldBeUndefined = postWithDeletedComment.comments.find(
                    comment => comment.id === id
                  );
                  const commentFromCommentsThatShouldBeUndefined = commentsWithDeletedComment.find(
                    comment => comment.id === id
                  );
                  expect(commentFromUserThatShouldBeUndefined).toBeFalsy();
                  expect(commentFromPostThatShouldBeUndefined).toBeFalsy();
                  expect(commentFromCommentsThatShouldBeUndefined).toBeFalsy();
                })
                .catch(e => done(e));
            })
            .end(err => {
              checkIfError(err, done);
            });
        })
        .catch(e => done(e));
    });

    it('#should throw 403 with verification errors (wrong user)', done => {
      Promise.all([
        User.findOne({ 'posts.0': { $exists: false } }),
        User.findOne({ 'posts.0': { $exists: true } }).populate({
          path: 'posts',
          select: 'comments',
          populate: {
            path: 'comments',
            select: 'id'
          }
        })
      ])
        .then(users => {
          const [userWithoutComments, userWithComments] = users;
          const token = makeToken(userWithoutComments);
          const route = `/api/v1/comments/${userWithComments.posts[0].comments[0].id}`;
          const error = {
            title: ERROR.WRONG_PERMISSIONS,
            description: ERROR.COMMENT_NOT_FROM_USER
          };

          assertSomeError(route, null, token, done, error, 403, 'delete');
        })
        .catch(e => done(e));
    });

    it('#should throw 403 with verification errors (comment doesnt exist)', done => {
      User.findOne({ 'posts.0': { $exists: true } })
        .populate({
          path: 'posts',
          select: 'comments',
          populate: {
            path: 'comments',
            select: 'id'
          }
        })
        .then(user => {
          const token = makeToken(user);
          const route = `/api/v1/comments/12313`;
          const error = {
            title: ERROR.WRONG_PERMISSIONS,
            description: ERROR.COMMENT_NOT_FROM_USER
          };
          assertSomeError(route, null, token, done, error, 403, 'delete');
        })
        .catch(e => done(e));
    });

    it('#should throw 401 with user no authenticated', done => {
      assertNoAuthenticated('/api/v1/comments/user/', invalidToken, done, 'delete');
    });
  });
});
