// import libraries
import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config({ path: '.env-dev' });

// create new pool using variable .env
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// check if pool query is valid, then display log message
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection Error:', err);
  } else {
    console.log('Connected to PostgreSQL at:', res.rows[0].now);
  }
});

// export pool
export { pool };
