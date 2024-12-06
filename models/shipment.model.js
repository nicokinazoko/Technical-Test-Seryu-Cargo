// import functions
import { pool } from '../config/db.js';

/**
 * Retrieves a list of shipments from the database, with optional filters for month, year, and shipment status.
 *
 * @param {Object} params - The parameters for filtering the shipment data.
 * @param {number} [params.month] - The month to filter the shipments (1-12).
 * @param {number} [params.year] - The year to filter the shipments.
 * @param {string} [params.status] - The status to filter the shipments (e.g., 'PENDING', 'COMPLETED').
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of shipment records matching the specified filters.
 *   - The array contains shipment objects, with the `shipment_date` formatted as a localized date string.
 *
 * @throws {Error} - If there is an error while querying the database or processing the request.
 *
 * @example
 * // Example call
 * const shipments = await GetAllShipments({ month: 12, year: 2024 });
 * console.log(shipments); // List of shipments for December 2024
 */

async function GetAllShipments({ month, year, status }) {
  try {
    let shipments;

    const paramsFilterShipment = [];

    // define param index 1 for query filter
    let paramIndex = 1;

    // define main query for get all data
    let queryGetAllShipments = `SELECT * FROM shipments WHERE shipment_status != 'CANCELLED'`;

    // if filter month is used
    if (month) {
      queryGetAllShipments += ` AND EXTRACT(MONTH from shipment_date) = $${paramIndex}`;
      paramsFilterShipment.push(month);
      paramIndex++;
    }

    // if filter year is used
    if (year) {
      queryGetAllShipments += ` AND EXTRACT(ISOYEAR from shipment_date) = $${paramIndex}`;
      paramsFilterShipment.push(year);
      paramIndex++;
    }

    // get data shipments based on query parameters
    shipments = await pool.query(queryGetAllShipments, paramsFilterShipment);

    // map data shipment date to use local date conversion
    shipments.rows = shipments.rows.map((row) => ({
      ...row,
      shipment_date: new Date(row.shipment_date).toLocaleDateString(),
    }));

    // return data shipments
    return shipments.rows;
  } catch (error) {
    console.error('Error querying GetAllShipments:', error.stack);
    throw new Error(`Error querying GetAllShipments: ${error.message}`);
  }
}

// export functions
export { GetAllShipments };
