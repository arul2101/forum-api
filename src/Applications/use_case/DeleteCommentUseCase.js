class DeleteCommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(user_id, comment_id, thread_id) {
    await this._threadRepository.checkThreadAvailableInDatabase(thread_id);
    await this._commentRepository.checkCommentAvailableInDatabase(comment_id, thread_id);
    await this._commentRepository.verifyOwnerCommentThread(comment_id, user_id);
    return this._commentRepository.deleteCommentById(comment_id);
  }
}

module.exports = DeleteCommentUseCase;