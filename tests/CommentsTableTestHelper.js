/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123123',
    content = 'haloo from komen',
    owner = 'user-123123',
    thread_id = 'thread-123123',
  }) {
    const created_at = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $5)',
      values: [id, content, owner, thread_id, created_at],
    };

    await pool.query(query);
  },

  async findComments(comment_id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND deleted_at IS NULL',
      values: [comment_id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;