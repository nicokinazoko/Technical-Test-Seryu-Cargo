import { pool } from '../config/db.js';

async function GetAllShipmentCosts(driver_code, shipment_no) {
  try {
    let shipmentCostBasedOnFilter;

    shipmentCostBasedOnFilter = await pool.query(
      `SELECT * FROM shipment_costs 
          WHERE shipment_status != 'CANCELLED'`
    );
  } catch (error) {
    console.log('Error querying GetShipmentCosts:', error);
  }
}

export { GetAllShipmentCosts };
