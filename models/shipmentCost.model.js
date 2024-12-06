import { pool } from '../config/db.js';

async function GetAllShipmentCosts({ month, year, driver_code }) {
  try {
    const paramsFilterShipmentCost = [];
    let paramIndex = 1;

    let query = `
      SELECT * FROM public.shipment_costs shipment_cost 
      JOIN shipments shipment 
      ON shipment_cost.shipment_no = shipment.shipment_no 
      WHERE shipment.shipment_status != 'CANCELLED'
    `;

    const baseTotalCostQuery = `
      SELECT COALESCE(SUM(shipment_cost.total_costs), 0) AS total_cost
      FROM public.shipment_costs shipment_cost 
      JOIN shipments shipment 
      ON shipment_cost.shipment_no = shipment.shipment_no 
      WHERE shipment.shipment_status != 'CANCELLED'
    `;

    let queryTotalShipment = `
      SELECT COALESCE(COUNT(DISTINCT shipment_cost.shipment_no), 0) AS total_shipment
      FROM public.shipment_costs shipment_cost 
      JOIN shipments shipment 
      ON shipment_cost.shipment_no = shipment.shipment_no 
      WHERE shipment.shipment_status != 'CANCELLED'
    `;

    let queryCountTotalShipmentCostPending = `${baseTotalCostQuery} AND shipment_cost.cost_status = 'PENDING'`;
    let queryCountTotalShipmentCostConfirmed = `${baseTotalCostQuery} AND shipment_cost.cost_status = 'CONFIRMED'`;
    let queryCountTotalShipmentCostPaid = `${baseTotalCostQuery} AND shipment_cost.cost_status = 'PAID'`;

    if (month) {
      query += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostPending += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostConfirmed += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostPaid += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryTotalShipment += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      paramsFilterShipmentCost.push(month);
      paramIndex++;
    }

    if (year) {
      query += ` AND EXTRACT(ISOYEAR FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostPending += ` AND EXTRACT(ISOYEAR FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostConfirmed += ` AND EXTRACT(ISOYEAR FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostPaid += ` AND EXTRACT(ISOYEAR FROM shipment.shipment_date) = $${paramIndex}`;
      queryTotalShipment += ` AND EXTRACT(ISOYEAR FROM shipment.shipment_date) = $${paramIndex}`;
      paramsFilterShipmentCost.push(year);
      queryTotalShipment;
      paramIndex++;
    }

    if (driver_code) {
      query += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryCountTotalShipmentCostPending += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryCountTotalShipmentCostConfirmed += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryCountTotalShipmentCostPaid += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryTotalShipment += ` AND shipment_cost.driver_code = $${paramIndex}`;
      paramsFilterShipmentCost.push(driver_code);
      paramIndex++;
    }

    // Get totals
    const totalShipmentCostPendingResult = await pool.query(
      queryCountTotalShipmentCostPending,
      paramsFilterShipmentCost
    );
    const totalShipmentCostConfirmedResult = await pool.query(
      queryCountTotalShipmentCostConfirmed,
      paramsFilterShipmentCost
    );
    const totalShipmentCostPaidResult = await pool.query(
      queryCountTotalShipmentCostPaid,
      paramsFilterShipmentCost
    );

    const totalShipment = await pool.query(
      queryTotalShipment,
      paramsFilterShipmentCost
    );

    const shipmentCosts = await pool.query(query, paramsFilterShipmentCost);

    return {
      shipment_costs: shipmentCosts,
      total_shipment_cost_pending:
        +totalShipmentCostPendingResult.rows[0].total_cost,
      total_shipment_cost_confirmed:
        +totalShipmentCostConfirmedResult.rows[0].total_cost,
      total_shipment_cost_paid: +totalShipmentCostPaidResult.rows[0].total_cost,
      total_shipment: +totalShipment.rows[0].total_shipment,
    };
  } catch (error) {
    console.error('Error querying GetAllShipmentCosts:', error);
    throw new Error('Failed to retrieve shipment costs.');
  }
}

export { GetAllShipmentCosts };
