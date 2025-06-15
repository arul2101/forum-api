const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComent = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(user_id, thread_id, { content }) {
    const id = `comment-${this._idGenerator()}`;
    const created_at = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner',
      values: [id, content, user_id, thread_id, created_at],
    };

    const { rows } = await this._pool.query(query);

    return new AddedComent({ ...rows[0] });
  }

  async getCommentsThreadById(thread_id) {
    const query = {
      text: `SELECT comments.id, users.username, comments.created_at, comments.content, comments.deleted_at
      FROM comments
      LEFT JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1
      GROUP BY comments.id, users.id
      ORDER BY comments.created_at ASC`,
      values: [thread_id],
    };

    const { rows: comments } = await this._pool.query(query);

    return comments;
  }

  async deleteCommentById(comment_id) {
    const deleted_at = new Date().toISOString();
    const query = {
      text: 'UPDATE comments SET deleted_at = $1 WHERE id = $2',
      values: [deleted_at, comment_id],
    };

    await this._pool.query(query);
  }

  async checkCommentAvailableInDatabase(comment_id, thread_id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND deleted_at IS NULL AND thread_id = $2',
      values: [comment_id, thread_id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan!');
    }
  }

  async verifyOwnerCommentThread(comment_id, user_id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [comment_id, user_id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('Kamu tidak berhak mengakses resource ini!');
    }
  }
}

module.exports = CommentRepositoryPostgres;