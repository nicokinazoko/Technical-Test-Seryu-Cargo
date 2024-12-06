import { pool } from '../config/db.js';

async function GetAllShipments({ month, year, status }) {
  try {
    let shipments;

    const paramsFilterShipment = [];
    let paramIndex = 1;
    let queryGetAllShipments = `SELECT * FROM shipments WHERE shipment_status != 'CANCELLED'`;

    if (month) {
      queryGetAllShipments += ` AND EXTRACT(MONTH from shipment_date) = $${paramIndex}`;
      paramsFilterShipment.push(month);
      paramIndex++;
    }

    if (year) {
      queryGetAllShipments += ` AND EXTRACT(ISOYEAR from shipment_date) = $${paramIndex}`;
      paramsFilterShipment.push(year);
      paramIndex++;
    }

    shipments = await pool.query(queryGetAllShipments, paramsFilterShipment);

    shipments.rows = shipments.rows.map((row) => ({
      ...row,
      shipment_date: new Date(row.shipment_date).toLocaleDateString(),
    }));
    return shipments.rows;
  } catch (error) {
    console.error('Error querying GetAllShipments:', error.stack);
    throw new Error(`Error querying GetAllShipments: ${error.message}`);
  }
}

export { GetAllShipments };
