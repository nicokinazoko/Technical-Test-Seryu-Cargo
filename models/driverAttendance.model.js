// import functions
import { pool } from '../config/db.js';

/**
 * Retrieves a list of driver attendances from the database with optional filters for driver code, month, and year.
 *
 * @param {Object} params - The parameters for filtering the driver attendance data.
 * @param {string} [params.driver_code] - A specific driver code to filter the attendances.
 * @param {number} [params.month] - The month to filter the attendances (1-12).
 * @param {number} [params.year] - The year to filter the attendances.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the driver attendances list and the total row count.
 *   - `driver_attendance` (Array): A list of driver attendance records matching the specified filters.
 *   - `totalRowCount` (number): The total number of driver attendance records available based on the applied filters.
 *
 * @throws {Error} - If there is an error while querying the database or processing the request.
 *
 * @example
 * // Example call
 * const result = await GetAllDriverAttendances({ driver_code: 'D001', month: 12, year: 2024 });
 * console.log(result.driver_attendance); // List of driver attendances
 * console.log(result.totalRowCount); // Total number of driver attendance records
 */

async function GetAllDriverAttendances({ driver_code, month, year }) {
  try {
    const queryparamsFilterDriverAttendance = [];

    // define param index 1 for query filter
    let paramIndex = 1;

    // define main query for get all data
    let query =
      'SELECT * FROM driver_attendances WHERE attendance_status = TRUE';

    // define query to find total data
    let queryCountData =
      'SELECT count(*) FROM driver_attendances WHERE attendance_status = TRUE';

    // if filter driver code is used
    if (driver_code) {
      query += ` AND driver_code = $${paramIndex} `;
      queryCountData += ` AND driver_code = $${paramIndex} `;
      queryparamsFilterDriverAttendance.push(driver_code);
      paramIndex++;
    }

    // if filter month is used
    if (month) {
      query += ` AND EXTRACT(MONTH from attendance_date) = $${paramIndex}`;
      queryCountData += ` AND EXTRACT(MONTH from attendance_date) = $${paramIndex}`;
      queryparamsFilterDriverAttendance.push(month);
      paramIndex++;
    }

    // if filter year is used
    if (year) {
      query += ` AND EXTRACT(ISOYEAR from attendance_date) = $${paramIndex}`;
      queryCountData += ` AND EXTRACT(ISOYEAR from attendance_date) = $${paramIndex}`;
      queryparamsFilterDriverAttendance.push(year);
      paramIndex++;
    }

    // get count data based on query total data
    const totalCountResult = await pool.query(
      queryCountData,
      queryparamsFilterDriverAttendance
    );
    
    const totalRowCount = +totalCountResult.rows[0].count;


    // get all drive attendance data
    const driverAttendances = await pool.query(
      query,
      queryparamsFilterDriverAttendance
    );

    // return driver attendance and total row
    return { driver_attendance: driverAttendances.rows, totalRowCount };
  } catch (error) {
    console.error('Error querying GetAllDriverAttendances:', error.stack);
    throw new Error(`Error from GetAllDriverAttendances: ${error.message}`);
  }
}

// export functions
export { GetAllDriverAttendances };
