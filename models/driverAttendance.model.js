import { pool } from '../config/db.js';

async function GetAllDriverAttendances({ driver_code, month, year }) {
  const queryparamsFilterDriverAttendance = [];
  let paramIndex = 1;
  let query = 'SELECT * FROM driver_attendances WHERE attendance_status = TRUE';
  let queryCountData =
    'SELECT count(*) FROM driver_attendances WHERE attendance_status = TRUE';

  if (driver_code) {
    query += ` AND driver_code = $${paramIndex} `;
    queryCountData += ` AND driver_code = $${paramIndex} `;
    queryparamsFilterDriverAttendance.push(driver_code);
    paramIndex++;
  }

  if (month) {
    query += ` AND EXTRACT(MONTH from attendance_date) = $${paramIndex}`;
    queryCountData += ` AND EXTRACT(MONTH from attendance_date) = $${paramIndex}`;
    queryparamsFilterDriverAttendance.push(month);
    paramIndex++;
  }

  if (year) {
    query += ` AND EXTRACT(ISOYEAR from attendance_date) = $${paramIndex}`;
    queryCountData += ` AND EXTRACT(ISOYEAR from attendance_date) = $${paramIndex}`;
    queryparamsFilterDriverAttendance.push(year);
    paramIndex++;
  }

  const totalCountResult = await pool.query(
    queryCountData,
    queryparamsFilterDriverAttendance
  );
  const totalRowCount = +totalCountResult.rows[0].count;

  const driverAttendances = await pool.query(
    query,
    queryparamsFilterDriverAttendance
  );
  return { driver_attendance: driverAttendances.rows, totalRowCount };
}

export { GetAllDriverAttendances };
