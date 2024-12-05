import { pool } from './config/db.js';

const getDrivers = async () => {
  try {
    const result = await pool.query('SELECT * FROM public.drivers');
    console.log('Drivers:', result.rows);
  } catch (err) {
    console.error('Error querying drivers:', err);
  }
};

getDrivers();
