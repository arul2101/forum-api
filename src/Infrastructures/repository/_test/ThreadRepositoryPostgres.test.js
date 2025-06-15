const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123123',
        fullname: 'testing fullname',
        password: 'rahasia',
        username: 'testing1234',
      });
    });

    it('should persist new thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Haloo from title',
        body: 'Haloo from body',
      });

      const fakeIdGenerator = () => '123456';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread('user-123123', {
        title: newThread.title,
        body: newThread.body,
      });

      // Assert
      const threads = await ThreadsTableTestHelper.findThreads('thread-123456');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Haloo from title',
        body: 'Haloo from body',
      });

      const fakeIdGenerator = () => '123456';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.addThread('user-123123', {
        title: newThread.title,
        body: newThread.body,
      });

      // Assert
      expect(thread).toStrictEqual(new AddedThread({
        id: 'thread-123456',
        title: 'Haloo from title',
        owner: 'user-123123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.getThreadById('not-found'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123123',
        username: 'testing1234',
        fullname: 'testing fullname',
        password: 'rahasia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123456',
        title: 'Haloo from title',
        body: 'Haloo from body',
        owner: 'user-123123',
      });

      const fakeIdGenerator = () => '123456';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123456');

      // Assert
      expect(thread.id).toStrictEqual('thread-123456');
      expect(thread.title).toStrictEqual('Haloo from title');
      expect(thread.body).toStrictEqual('Haloo from body');
      expect(thread.date).toBeTruthy();
      expect(thread.username).toStrictEqual('testing1234');
    });
  });

  describe('checkThreadAvailableInDatabase function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkThreadAvailableInDatabase('not-found'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123123',
        username: 'testing1234',
        fullname: 'testing fullanme',
        password: 'rahasia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123123',
        title: 'Haloo from title',
        body: 'Haloo from body',
        owner: 'user-123123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkThreadAvailableInDatabase('thread-123123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
});