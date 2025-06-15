const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'haloo from komen',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123456',
      content: 'haloo from komen',
      owner: 'user-123456',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadAvailableInDatabase = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute('user-123456', 'thread-123456', { content: useCasePayload.content });

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123456',
      content: 'haloo from komen',
      owner: 'user-123456',
    }));
    expect(mockThreadRepository.checkThreadAvailableInDatabase).toBeCalledWith('thread-123456');
    expect(mockCommentRepository.addComment).toBeCalledWith('user-123456', 'thread-123456', new NewComment({ content: 'haloo from komen' }));
  });
});