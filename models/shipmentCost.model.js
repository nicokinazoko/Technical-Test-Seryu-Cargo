// import functions
import { pool } from '../config/db.js';

/**
 * Retrieves shipment cost data, including totals for pending, confirmed, and paid costs, based on optional filters for month, year, and driver code.
 *
 * @param {Object} params - The parameters for filtering the shipment cost data.
 * @param {number} [params.month] - The month to filter the shipment costs (1-12).
 * @param {number} [params.year] - The year to filter the shipment costs.
 * @param {string} [params.driver_code] - The driver code to filter the shipment costs.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing:
 *   - `shipment_costs`: An array of shipment cost records.
 *   - `total_shipment_cost_pending`: The total cost for pending shipments.
 *   - `total_shipment_cost_confirmed`: The total cost for confirmed shipments.
 *   - `total_shipment_cost_paid`: The total cost for paid shipments.
 *   - `total_shipment`: The total number of shipments.
 *
 * @throws {Error} - If there is an error while querying the database or processing the request.
 *
 * @example
 * // Example call
 * const shipmentCosts = await GetAllShipmentCosts({ month: 12, year: 2024, driver_code: 'D001' });
 * console.log(shipmentCosts); // List of shipment costs for December 2024, driver D001
 */

async function GetAllShipmentCosts({ month, year, driver_code }) {
  try {
    const paramsFilterShipmentCost = [];

    // define param index 1 for query filter
    let paramIndex = 1;

    // define main query for get all data
    let query = `
      SELECT * FROM public.shipment_costs shipment_cost 
      LEFT JOIN shipments shipment 
      ON shipment_cost.shipment_no = shipment.shipment_no 
      WHERE shipment.shipment_status != 'CANCELLED'
    `;

    // define query for get total cost
    const baseTotalCostQuery = `
      SELECT COALESCE(SUM(shipment_cost.total_costs), 0) AS total_cost
      FROM public.shipment_costs shipment_cost 
      LEFT JOIN shipments shipment 
      ON shipment_cost.shipment_no = shipment.shipment_no 
      WHERE shipment.shipment_status != 'CANCELLED'
    `;

    // define query for get total shipments
    let queryTotalShipment = `
      SELECT COALESCE(COUNT(DISTINCT shipment_cost.shipment_no), 0) AS total_shipment
      FROM public.shipment_costs shipment_cost 
      LEFT JOIN shipments shipment 
      ON shipment_cost.shipment_no = shipment.shipment_no 
      WHERE shipment.shipment_status != 'CANCELLED'
    `;

    // add filter cost status pending for total pending cost
    let queryCountTotalShipmentCostPending = `${baseTotalCostQuery} AND shipment_cost.cost_status = 'PENDING'`;

    // add filter cost status confirmed for total confirmed cost
    let queryCountTotalShipmentCostConfirmed = `${baseTotalCostQuery} AND shipment_cost.cost_status = 'CONFIRMED'`;

    // add filter cost status paid for total paid cost
    let queryCountTotalShipmentCostPaid = `${baseTotalCostQuery} AND shipment_cost.cost_status = 'PAID'`;

    // if filter month is used
    if (month) {
      query += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostPending += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostConfirmed += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryCountTotalShipmentCostPaid += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      queryTotalShipment += ` AND EXTRACT(MONTH FROM shipment.shipment_date) = $${paramIndex}`;
      paramsFilterShipmentCost.push(month);
      paramIndex++;
    }

    // if filter year is used
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

    // if filter driver code is used
    if (driver_code) {
      query += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryCountTotalShipmentCostPending += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryCountTotalShipmentCostConfirmed += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryCountTotalShipmentCostPaid += ` AND shipment_cost.driver_code = $${paramIndex}`;
      queryTotalShipment += ` AND shipment_cost.driver_code = $${paramIndex}`;
      paramsFilterShipmentCost.push(driver_code);
      paramIndex++;
    }

    // Get total cost pending
    const totalShipmentCostPendingResult = await pool.query(
      queryCountTotalShipmentCostPending,
      paramsFilterShipmentCost
    );

    // get total cost confirmed
    const totalShipmentCostConfirmedResult = await pool.query(
      queryCountTotalShipmentCostConfirmed,
      paramsFilterShipmentCost
    );

    // get total cost paid
    const totalShipmentCostPaidResult = await pool.query(
      queryCountTotalShipmentCostPaid,
      paramsFilterShipmentCost
    );

    // get all data shipment based on query
    const totalShipment = await pool.query(
      queryTotalShipment,
      paramsFilterShipmentCost
    );

    // get shipment costs based on query
    const shipmentCosts = await pool.query(query, paramsFilterShipmentCost);

    // return shipment costs
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
    console.error('Error querying GetAllShipmentCosts:', error.stack);
    throw new Error(`Error querying GetAllShipmentCosts: ${error.message}`);
  }
}

// export functions
export { GetAllShipmentCosts };
