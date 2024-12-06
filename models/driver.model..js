// import functions
import { pool } from '../config/db.js';

/**
 * Retrieves a list of drivers from the database with optional filters and pagination.
 *
 * @param {Object} params - The parameters for filtering and pagination.
 * @param {string} [params.driver_code] - A specific driver code to filter the drivers.
 * @param {string} [params.name] - A name or partial name to filter the drivers.
 * @param {number} [params.page_size] - The number of drivers to fetch per page.
 * @param {number} [params.current] - The current page number for pagination.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the drivers list and the total row count.
 *   - `drivers` (Array): A list of driver objects matching the specified filters and pagination.
 *   - `totalRowCount` (number): The total number of drivers available based on the applied filters.
 *
 * @throws {Error} - If there is an error while querying the database or processing the request.
 *
 * @example
 * // Example call
 * const result = await GetAllDrivers({ driver_code: 'D001', name: 'John', page_size: 10, current: 1 });
 * console.log(result.drivers); // List of drivers
 * console.log(result.totalRowCount); // Total number of drivers
 */

async function GetAllDrivers({ driver_code, name, page_size, current }) {
  try {
    const paramsFilterDriver = [];

    // define param index 1 for query filter
    let paramIndex = 1;

    // define main query for get all data
    let query = 'SELECT * FROM drivers';

    // define query to find total data
    let queryCountData = 'SELECT count(*) FROM drivers';

    // if filter driver code is used
    if (driver_code) {
      query += ` WHERE driver_code = $${paramIndex} `;
      queryCountData += ` WHERE driver_code = $${paramIndex} `;
      paramsFilterDriver.push(driver_code);
      paramIndex++;
    }

    // if filter name is used
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

    // get total count based on query
    const totalCountResult = await pool.query(
      queryCountData,
      paramsFilterDriver
    );

    const totalRowCount = +totalCountResult.rows[0].count;

    // if page size and current is passed as parameter
    if (page_size && current) {
      // set offset
      const offset = (current - 1) * page_size;

      // set query for get data pagination
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1} `;
      paramsFilterDriver.push(page_size, offset);
      paramIndex += 2;
    }

    // get data drivers based on query get all data
    const drivers = await pool.query(query, paramsFilterDriver);

    // return function with drivers and total row
    return { drivers: drivers.rows, totalRowCount };
  } catch (error) {
    console.error('Error querying GetAllDrivers:', error.stack);
    throw new Error('Error from GetAllDrivers : ', error.message);
  }
}

// export functions
export { GetAllDrivers };
