const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const mockThread = {
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
      date: '2025-06-12T11:47:54.583Z',
      username: 'usernametesting',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'agung123',
        created_at: '2025-06-12T11:47:54.583Z',
        content: 'haloo from komen 1',
        deleted_at: null,
      },
      {
        id: 'comment-456',
        username: 'jordy123',
        created_at: '2025-06-12T11:47:54.583Z',
        content: 'haloo from komen 2',
        deleted_at: null,
      },
      {
        id: 'comment-789',
        username: 'faisal123',
        created_at: '2025-06-12T11:47:54.583Z',
        content: 'haloo from komen 3',
        deleted_at: null,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsThreadById = jest.fn(() => Promise.resolve(mockComments));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute('thread-123456');

    // Assert
    expect(thread).toStrictEqual(new DetailThread({
      id: 'thread-123456',
      title: 'haloo from title',
      body: 'haloo from body',
      date: '2025-06-12T11:47:54.583Z',
      username: 'usernametesting',
      comments: mockComments.map((comment) => new DetailComment({
        id: comment.id,
        username: comment.username,
        content: comment.content,
        date: comment.created_at,
        is_delete: !!comment.deleted_at,
      })),
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123456');
    expect(mockCommentRepository.getCommentsThreadById).toBeCalledWith('thread-123456');
  });
});