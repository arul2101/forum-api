const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const UtilsTestHelper = require('../../../../tests/UtilsTestHelper');

describe('comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and add comment', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);
      const payloadComment = {
        content: 'haloo from komen',
      };
      const payloadThread = {
        id: 'thread-123456',
        title: 'haloo from title',
        body: 'haloo from body',
      };
      const userId = await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/threads/${payloadThread.id}/comments`,
        payload: payloadComment,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const {
        status,
        data: {
          addedComment,
        },
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(201);
      expect(status).toEqual('success');
      expect(addedComment).toBeTruthy();
      expect(addedComment.content).toEqual(payloadComment.content);
    });

    it('should response 400 when request payload not cointain property', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);

      const payloadThread = {
        id: 'thread-123456',
        title: 'haloo from title',
        body: 'haloo from body',
      };

      const userId = await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/threads/${payloadThread.id}/comments`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const {
        status,
        message,
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(400);
      expect(status).toEqual('fail');
      expect(message).toEqual('Gagal membuat komentar thread! Harus terdapat: content!');
    });

    it('should response 400 when request payload data type is wrong', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);
      const payloadComment = {
        content: 99999,
      };
      const payloadThread = {
        id: 'thread-123456',
        title: 'haloo from title',
        body: 'haloo from body',
      };

      const userId = await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/threads/${payloadThread.id}/comments`,
        payload: payloadComment,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const {
        status,
        message,
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(400);
      expect(status).toEqual('fail');
      expect(message).toEqual('Gagal membuat komentar thread! Tipe data content harus string!');
    });

    it('should response 401 when unauthorized', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);
      const payloadComment = {
        content: 'haloo from komen',
      };
      const payloadThread = {
        id: 'thread-123456',
        title: 'haloo from title',
        body: 'haloo from body',
      };

      const userId = await utilsTestHelper.registerAndGetUserId();

      await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/threads/${payloadThread.id}/comments`,
        payload: payloadComment,
      });

      const {
        error,
        message,
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(401);
      expect(error).toEqual('Unauthorized');
      expect(message).toEqual('Missing authentication');
    });

    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);

      const payloadComment = {
        content: 'haloo from komen',
      };

      const threadId = 'not-found-404';

      await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: payloadComment,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const {
        status,
        message,
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(404);
      expect(status).toEqual('fail');
      expect(message).toEqual('Thread tidak ditemukan!');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);
      const userId = await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      const payloadThread = {
        id: 'thread-123456',
        title: 'haloo from title',
        body: 'haloo from body',
      };

      const payloadComment = {
        id: 'comment-123456',
        content: 'haloo from komen',
        thread_id: payloadThread.id,
        owner: userId,
      };

      await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });
      await CommentsTableTestHelper.addComment({ ...payloadComment });

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'DELETE',
        url: `/threads/${payloadThread.id}/comments/${payloadComment.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { status } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(200);
      expect(status).toEqual('success');
    });
  });

  it('should response 404 when comment not found', async () => {
    // Arrange
    const server = await createServer(container);
    const utilsTestHelper = new UtilsTestHelper(server);
    const userId = await utilsTestHelper.registerAndGetUserId();
    const accessToken = await utilsTestHelper.loginAndGetAccessToken();
    const payloadThread = {
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
    };

    const commentId = 'not-found-123';

    await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });

    // Action
    const { statusCode, payload } = await server.inject({
      method: 'DELETE',
      url: `/threads/${payloadThread.id}/comments/${commentId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { status, message } = JSON.parse(payload);

    // Assert
    expect(statusCode).toEqual(404);
    expect(status).toEqual('fail');
    expect(message).toEqual('Komentar tidak ditemukan!');
  });

  it('should response 403 when owner dont have access resource', async () => {
    // Arrange
    const server = await createServer(container);
    const utilsTestHelper = new UtilsTestHelper(server);
    const userId = await utilsTestHelper.registerAndGetUserId();
    const accessToken = await utilsTestHelper.loginAndGetAccessToken();

    const payloadThread = {
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
    };

    const payloadComment = {
      id: 'comment-123456',
      content: 'haloo from komen',
      thread_id: payloadThread.id,
      owner: userId,
    };

    // Other User
    const otherUser = {
      username: 'otheruser123',
      password: 'rahasia',
      fullname: 'other user',
    };

    const { payload: payloadRegister } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: otherUser,
    });

    const { payload: payloadLogin } = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: otherUser.username,
        password: otherUser.password,
      },
    });

    const { data: { accessToken: accessTokenOtherUser } } = JSON.parse(payloadLogin);
    const { data: { addedUser: { id } } } = JSON.parse(payloadRegister);

    await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });
    await CommentsTableTestHelper.addComment({ ...payloadComment });

    // Action
    const { statusCode, payload } = await server.inject({
      method: 'DELETE',
      url: `/threads/${payloadThread.id}/comments/${payloadComment.id}`,
      headers: { Authorization: `Bearer ${accessTokenOtherUser}` },
    });

    const { status, message } = JSON.parse(payload);

    // Assert
    expect(statusCode).toEqual(403);
    expect(status).toEqual('fail');
    expect(message).toEqual('Kamu tidak berhak mengakses resource ini!');
  });

  it('should response 401 when unauthorized', async () => {
    // Arrange
    const server = await createServer(container);
    const utilsTestHelper = new UtilsTestHelper(server);
    const userId = await utilsTestHelper.registerAndGetUserId();

    const payloadThread = {
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
    };

    const payloadComment = {
      id: 'comment-123456',
      content: 'haloo from komen',
      thread_id: payloadThread.id,
      owner: userId,
    };

    await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: userId });
    await CommentsTableTestHelper.addComment({ ...payloadComment });

    // Action
    const { statusCode, payload } = await server.inject({
      method: 'DELETE',
      url: `/threads/${payloadThread.id}/comments/${payloadComment.id}`,
    });

    // Assert
    const {
      error,
      message,
    } = JSON.parse(payload);

    // Assert
    expect(statusCode).toEqual(401);
    expect(error).toEqual('Unauthorized');
    expect(message).toEqual('Missing authentication');
  });
});