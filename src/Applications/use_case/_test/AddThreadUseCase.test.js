const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Haloo thread',
      body: 'Haloo thread from body',
    };

    const mockAddedThread = new AddedThread({ id: 'thread-123123', title: 'Haloo thread', owner: 'user-123123' });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

    const getThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Acction
    const addedThread = await getThreadUseCase.execute(mockAddedThread.owner, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123123',
      title: useCasePayload.title,
      owner: 'user-123123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(mockAddedThread.owner, {
      title: useCasePayload.title,
      body: useCasePayload.body,
    });
  });
});
