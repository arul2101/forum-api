const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const UtilsTestHelper = require('../../../../tests/UtilsTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and add thread', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);

      const payloadThread = {
        title: 'Haloo from title',
        body: 'Haloo from body',
      };

      await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: payloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        status,
        data: {
          addedThread,
        },
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(201);
      expect(status).toEqual('success');
      expect(addedThread).toBeDefined();
      expect(addedThread.title).toEqual('Haloo from title');
    });

    it('should response 400 when request payload data type is wrong', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);
      await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      const payloadThread = {
        title: 'Haloo from title',
        body: 999,
      };

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: payloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        status,
        message,
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(400);
      expect(status).toEqual('fail');
      expect(message).toEqual('Gagal membuat thread! Tipe data title, body harus string!');
    });

    it('should response 401 when unauthorized', async () => {
      // Arrange
      const server = await createServer(container);
      const payloadThread = {
        title: 'Haloo from title',
        body: 'Haloo from body',
      };

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: payloadThread,
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

    it('should response 400 when request payload not cointain property', async () => {
      // Arrange
      const server = await createServer(container);
      const utilsTestHelper = new UtilsTestHelper(server);
      await utilsTestHelper.registerAndGetUserId();
      const accessToken = await utilsTestHelper.loginAndGetAccessToken();

      const payloadThread = {
        title: 'Haloo from title',
      };

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: payloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        status,
        message,
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(400);
      expect(status).toEqual('fail');
      expect(message).toEqual('Gagal membuat thread! Harus terdapat: title, body!');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and get detail thread', async () => {
      // Arrange
      const server = await createServer(container);

      const payloadUser = {
        id: 'user-123456',
        username: 'testing1234',
        fullname: 'testing testing',
        password: 'rahasia',
      };

      const payloadThread = {
        id: 'thread-123456',
        title: 'haloo from title',
        body: 'haloo from body',
      };

      await UsersTableTestHelper.addUser({ ...payloadUser });
      await ThreadsTableTestHelper.addThread({ ...payloadThread, owner: payloadUser.id });

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/threads/${payloadThread.id}`,
      });

      const {
        status,
        data: {
          thread: {
            id,
            title,
            body,
            date,
            username,
          },
        },
      } = JSON.parse(payload);

      // Assert
      expect(statusCode).toEqual(200);
      expect(status).toEqual('success');
      expect(id).toEqual(payloadThread.id);
      expect(title).toEqual(payloadThread.title);
      expect(body).toEqual(payloadThread.body);
      expect(date).toBeDefined();
      expect(username).toEqual(payloadUser.username);
    });

    it('should response 404 when thread doesnt exist', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'not-found-123';

      // Action
      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
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
});