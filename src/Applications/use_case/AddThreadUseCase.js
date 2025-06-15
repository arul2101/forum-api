const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(user_id, useCasePayload) {
    const thread = new NewThread(useCasePayload);
    const addedThread = this._threadRepository.addThread(user_id, { title: thread.title, body: thread.body });
    return addedThread;
  }
}

module.exports = AddThreadUseCase;