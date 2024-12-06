import { pool } from '../config/db.js';

async function GetAllDrivers({ driver_code, name, page_size, current }) {
  try {
    const paramsFilterDriver = [];
    let paramIndex = 1;
    let query = 'SELECT * FROM drivers';
    let queryCountData = 'SELECT count(*) FROM drivers';

    if (driver_code) {
      query += ` WHERE driver_code = $${paramIndex} `;
      queryCountData += ` WHERE driver_code = $${paramIndex} `;
      paramsFilterDriver.push(driver_code);
      paramIndex++;
    }

    if (name) {
      if (paramsFilterDriver.length) {
        query += ` AND name ILIKE $${paramIndex} `;
        queryCountData += ` AND name ILIKE $${paramIndex} `;
      } else {
        query += ` WHERE name ILIKE $${paramIndex} `;
        queryCountData += ` WHERE name ILIKE $${paramIndex} `;
      }

      paramsFilterDriver.push(`%${name}%`);
      paramIndex++;
    }

    const totalCountResult = await pool.query(
      queryCountData,
      paramsFilterDriver
    );
    const totalRowCount = +totalCountResult.rows[0].count;

    if (page_size && current) {
      const offset = (current - 1) * page_size;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1} `;
      paramsFilterDriver.push(page_size, offset);
      paramIndex += 2;
    }

    const drivers = await pool.query(query, paramsFilterDriver);
    return { drivers: drivers.rows, totalRowCount };
  } catch (error) {
    console.error('Error querying GetAllDrivers:', error);
    throw new Error('Error from GetAllDrivers : ', error);
  }
}

export { GetAllDrivers };
