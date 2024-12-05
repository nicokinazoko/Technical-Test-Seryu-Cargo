import dotenv from 'dotenv';

dotenv.config({ path: '.env-dev' });

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection Error:', err);
  } else {
    console.log('Connected to PostgreSQL at:', res.rows[0].now);
  }
});

export { pool };
