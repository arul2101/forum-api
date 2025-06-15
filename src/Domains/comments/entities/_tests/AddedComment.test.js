const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    expect(() => new AddedComment({ content: 'haloo from komen' })).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    expect(() => new AddedComment({
      id: 'comment-123123',
      content: 'haloo from komen',
      owner: 999,
    })).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123123',
      content: 'haloo from komen',
      owner: 'user-123123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
    expect(addedComment).toBeInstanceOf(AddedComment);
  });
});
