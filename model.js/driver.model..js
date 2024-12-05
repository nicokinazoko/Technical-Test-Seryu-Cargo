import { pool } from '../config/db.js';

const GetDrivers = async () => {
  try {
    const result = await pool.query('SELECT * FROM drivers');
    console.log('Drivers:', result.rows);
  } catch (err) {
    console.error('Error querying drivers:', err);
  }
};

export { GetDrivers };
