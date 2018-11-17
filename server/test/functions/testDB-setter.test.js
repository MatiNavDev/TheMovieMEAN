const expect = require('expect');

const { addSomeCommentsToPost } = require('../../db/testDB-setter');
const User = require('../../model/user');
const Post = require('../../model/post');

describe('TestDB-Setter TEST', function() {
  this.timeout(4000);
  it('should add 15 comments to post and to user ', function(done) {
    this.timeout(4000);
    User.findOne({ 'posts.0': { $exists: true } })
      .populate({
        path: 'posts',
        select: 'comments'
      })
      .then(user => {
        const postFromUser = user.posts[0];
        addSomeCommentsToPost(postFromUser, user, 5);
        Post.findById(postFromUser.id)
          .populate({
            path: 'comments',
            select: 'post',
            populate: { path: 'post', select: 'id' }
          })
          .then(postWithSeveralComments => {
            try {
              expect(postWithSeveralComments.comments.length).toBe(16);
              expect(user.comments.length).toBe(16);
              postWithSeveralComments.comments.forEach(comment =>
                expect(comment.post.id).toBe(postWithSeveralComments.id)
              );
              return done();
            } catch (e) {
              return done(e);
            }
          })
          .catch(e => done(e));
      })
      .catch(e => done(e));
  });
});
