/* istanbul ignore file */
class UtilsTestHelper {
  constructor(server) {
    this._server = server;
  }

  async registerAndGetUserId() {
    const payloadUser = {
      username: 'testing1234',
      password: 'rahasia',
      fullname: 'testing testing',
    };

    const { payload: payloadRegister } = await this._server.inject({
      method: 'POST',
      url: '/users',
      payload: payloadUser,
    });

    const { data: { addedUser: { id } } } = JSON.parse(payloadRegister);
    return id;
  }

  async loginAndGetAccessToken() {
    const payloadUser = {
      username: 'testing1234',
      password: 'rahasia',
      fullname: 'testing testing',
    };

    const { payload: payloadLogin } = await this._server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: payloadUser.username,
        password: payloadUser.password,
      },
    });

    const { data: { accessToken } } = JSON.parse(payloadLogin);
    return accessToken;
  }
}

module.exports = UtilsTestHelper;