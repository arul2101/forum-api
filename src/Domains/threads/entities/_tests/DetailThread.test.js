const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    expect(() => new DetailThread({
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
    })).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    expect(() => new DetailThread({
      id: 'thread-123456',
      title: 9999,
      body: 'haloo from body',
      date: new Date().toISOString(),
      username: 'testingusername',
      comments: [],
    })).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
      date: '2025-06-12T11:47:54.583Z',
      username: 'testingusername',
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toStrictEqual(new DetailThread({
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
      date: '2025-06-12T11:47:54.583Z',
      username: 'testingusername',
      comments: [],
    }));
    expect(detailThread).toBeInstanceOf(DetailThread);
  });
});