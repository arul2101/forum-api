const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(user_id, thread_id, { content }) {
    await this._threadRepository.checkThreadAvailableInDatabase(thread_id);
    const comment = new NewComment({ content });
    return this._commentRepository.addComment(user_id, thread_id, { content: comment.content });
  }
}

module.exports = AddCommentUseCase;