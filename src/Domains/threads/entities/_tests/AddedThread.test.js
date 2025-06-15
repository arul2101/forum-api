const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    expect(() => new AddedThread({
      title: 'test title',
    })).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    expect(() => new AddedThread({
      id: 'thread-123123',
      title: 1234,
      owner: 'owner-123123',
    })).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123123',
      title: 'test title',
      owner: 'owner-123123',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
    expect(addedThread).toBeInstanceOf(AddedThread);
  });
});
