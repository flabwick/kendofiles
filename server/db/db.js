const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/filemanager'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
