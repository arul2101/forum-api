const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123123' });
    });

    it('should persist new comment', async () => {
      // Arrange
      const newComment = new NewComment({ content: 'haloo from comment!' });
      const fakeIdGenerator = () => '123456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment('user-123123', 'thread-123123', { content: newComment.content });

      // Assert
      const comments = await CommentsTableTestHelper.findComments('comment-123456');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment', async () => {
      // Arrange
      const newComment = new NewComment({ content: 'haloo from comment!' });
      const fakeIdGenerator = () => '123456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comment = await commentRepositoryPostgres.addComment('user-123123', 'thread-123123', { content: newComment.content });

      // Assert
      expect(comment).toStrictEqual(new AddedComment({
        id: 'comment-123456',
        content: 'haloo from comment!',
        owner: 'user-123123',
      }));
    });
  });

  describe('getCommentsThreadById fucntion', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123123' });
    });

    it('should return comments', async () => {
      // Arrange
      const fakeIdGenerator = () => '123456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await CommentsTableTestHelper.addComment({
        id: 'comment-asdasd12312',
        content: 'haloo from komen 1',
        thread_id: 'thread-123123',
        owner: 'user-123123',
      });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsThreadById('thread-123123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toStrictEqual('comment-asdasd12312');
      expect(comments[0].content).toStrictEqual('haloo from komen 1');
      expect(comments[0].username).toStrictEqual('dicoding');
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment and update deleted_at', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123123' });
      const fakeIdGenerator = () => '123456';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123123');

      // Assert
      const comments = await CommentsTableTestHelper.findComments('comment-123123');
      expect(comments).toHaveLength(0);
    });
  });

  describe('checkCommentAvailableInDatabase function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123123' });
    });

    it('should not throw NotFoundError when comment is available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123123',
        content: 'haloo from komen!',
        thread_id: 'thread-123123',
        owner: 'user-123123',
      });
      const fakeIdGenerator = () => '123456';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentAvailableInDatabase('comment-123123', 'thread-123123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123123',
        content: 'haloo from komen!',
        thread_id: 'thread-123123',
        owner: 'user-123123',
      });
      const fakeIdGenerator = () => '123456';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentAvailableInDatabase('comment-123123', 'thread-not-found'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyOwnerCommentThread function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123123' });
    });

    it('should not throw AuthorizationError when owner comment is authorized', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123123',
        thread_id: 'thread-123123',
        owner: 'user-123123',
      });
      const fakeIdGenerator = () => '123456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyOwnerCommentThread('comment-123123', 'user-123123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when owner comment is not authorized', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123123',
        thread_id: 'thread-123123',
        owner: 'user-123123',
      });
      const fakeIdGenerator = () => '123456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyOwnerCommentThread('comment-123123', 'other-user-id'))
        .rejects
        .toThrowError(AuthorizationError);
    });
  });
});