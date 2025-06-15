const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    expect(() => new NewThread({
      title: 'haloo from title',
    })).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    expect(() => new NewThread({
      title: 1234,
      body: 'haloo from body',
    })).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'haloo from title',
      body: 'haloo from body',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread).toBeInstanceOf(NewThread);
  });
});
