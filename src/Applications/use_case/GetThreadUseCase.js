const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(thread_id) {
    const thread = await this._threadRepository.getThreadById(thread_id);
    const comments = await this._commentRepository.getCommentsThreadById(thread_id);

    thread.comments = comments.map((comment) => new DetailComment({
      id: comment.id,
      username: comment.username,
      content: comment.content,
      date: comment.created_at,
      is_delete: !!comment.deleted_at,
    }));

    return new DetailThread(thread);
  }
}

module.exports = GetThreadUseCase;