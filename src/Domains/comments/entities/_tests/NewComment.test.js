const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    expect(() => new NewComment({})).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    expect(() => new NewComment({ content: 999 })).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'haloo from komen',
    };

    // Action
    const comment = new NewComment(payload);

    // Assert
    expect(comment.content).toEqual(payload.content);
    expect(comment).toBeInstanceOf(NewComment);
  });
});