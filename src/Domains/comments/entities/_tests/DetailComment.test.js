const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    expect(() => new DetailComment({ content: 'haloo from komen' })).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    expect(() => new DetailComment({
      id: 'comment-123123',
      username: 'testing1234',
      content: 999,
      date: new Date().toISOString(),
    })).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123123',
      username: 'testing1234',
      content: 'haloo from komen',
      date: new Date().toISOString(),
    };

    // Action
    const comment = new DetailComment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.content).toEqual(payload.content);
    expect(comment.date).toEqual(payload.date);
    expect(comment).toBeInstanceOf(DetailComment);
  });

  it('should create deleted DetailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123123',
      username: 'testing1234',
      content: 'haloo from komen',
      date: new Date().toISOString(),
      is_delete: true,
    };

    // Action
    const comment = new DetailComment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.content).toEqual('**komentar telah dihapus**');
    expect(comment.date).toEqual(payload.date);
    expect(comment).toBeInstanceOf(DetailComment);
  });
});
