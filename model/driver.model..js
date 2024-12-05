import { pool } from '../config/db.js';

async function GetAllDrivers({ driver_code }) {
  try {
    const paramsFilterDriver = [];
    let paramIndex = 1;
    let queryGetAllDriver = 'SELECT * FROM drivers';

    if (driver_code) {
      queryGetAllDriver += ` WHERE driver_code = $${paramIndex} `;
      paramsFilterDriver.push(driver_code);
      paramIndex++;
    }

    const drivers = await pool.query(queryGetAllDriver, paramsFilterDriver);

    return drivers.rows;
  } catch (error) {
    console.error('Error querying GetAllDrivers:', error);
    res.status(500).send({ error });
  }
}

export { GetAllDrivers };
