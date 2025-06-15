const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const userId = 'user-123456';
    const threadId = 'thread-123456';
    const commentId = 'comment-123456';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadAvailableInDatabase = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentAvailableInDatabase = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyOwnerCommentThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(userId, commentId, threadId);

    // Assert
    expect(mockThreadRepository.checkThreadAvailableInDatabase).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.checkCommentAvailableInDatabase).toHaveBeenCalledWith(commentId, threadId);
    expect(mockCommentRepository.verifyOwnerCommentThread).toHaveBeenCalledWith(commentId, userId);
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(commentId);
  });
});