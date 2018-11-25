const expect = require('expect');

const { refreshDB, addSomeCommentsToPost } = require('../../db/testDB-setter');
const User = require('../../model/user');
const Post = require('../../model/post');
const Comment = require('../../model/comment');

/**
 * Limpia toda la bd
 * @param {*} params
 */
function cleanDB() {
  beforeEach(function(done) {
    this.timeout(10000);
    refreshDB()
      .then(() => {
        done();
      })
      .catch(e => {
        done(e);
      });
  });
}

describe('TestDB-Setter TEST', function() {
  cleanDB();
  this.timeout(4000);
  it('should add 15 comments to post and to user', function(done) {
    this.timeout(4000);
    Promise.all([
      User.findOne({ 'posts.0': { $exists: true } })
        .populate({ path: 'posts', select: 'id comments' })
        .populate({ path: 'comments', select: 'id' })
        .exec(),
      Comment.find()
    ])
      .then(firstResp => {
        const [user, comments] = firstResp;
        const postSelectedToAddComments = user.posts[0];

        if (!user.comments) done('User has not comments');
        if (!postSelectedToAddComments.comments) done('Post has not comments');
        if (!comments) done(`There aren't comments`);

        const originalCommentsAmount = comments.length;
        const originalUserCommentsAmount = user.comments.length;
        const originalPostCommentsAmount = postSelectedToAddComments.comments.length;

        addSomeCommentsToPost(postSelectedToAddComments, user, 15)
          .then(() => {
            Promise.all([
              User.findById(user.id).populate({ path: 'comments', select: 'id' }),
              Post.findById(postSelectedToAddComments.id).populate({
                path: 'comments',
                select: 'id'
              }),
              Comment.find()
            ])
              .then(resp => {
                const [userDecorated, postDecorated, commentsDecorated] = resp;

                if (!userDecorated.comments) done('User has not comments');
                if (!postDecorated.comments) done('Post has not comments');
                if (!comments) done(`There aren't comments`);

                const decoratedCommentsAmount = commentsDecorated.length;
                const decoratedUserCommentsAmount = user.comments.length;
                const decoratedPostCommentsAmount = postDecorated.comments.length;

                expect(decoratedCommentsAmount - originalCommentsAmount).toBe(15);
                expect(decoratedUserCommentsAmount - originalUserCommentsAmount).toBe(15);
                expect(decoratedPostCommentsAmount - originalPostCommentsAmount).toBe(15);
                return done();
              })
              .catch(e => done(e));
          })
          .catch(e => done(e));
      })
      .catch(e => done(e));
  });
});
