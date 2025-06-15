const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(user_id, { title, body }) {
    const id = `thread-${this._idGenerator()}`;
    const created_at = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5, $5) RETURNING id, title, owner',
      values: [id, title, body, user_id, created_at],
    };

    const { rows } = await this._pool.query(query);
    return new AddedThread({ ...rows[0] });
  }

  async getThreadById(thread_id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads
      LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1
      GROUP BY threads.id, users.id`,
      values: [thread_id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Thread tidak ditemukan!');
    }

    const {
      id,
      title,
      body,
      created_at,
      username,
    } = rows[0];

    return {
      id,
      title,
      body,
      date: created_at,
      username,
    };
  }

  async checkThreadAvailableInDatabase(thread_id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [thread_id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Thread tidak ditemukan!');
    }
  }
}

module.exports = ThreadRepositoryPostgres;