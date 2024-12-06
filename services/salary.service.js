// import module
import { GetAllDrivers } from '../models/driver.model..js';
import { GetAllDriverAttendances } from '../models/driverAttendance.model.js';
import { GetVariableConfig } from '../models/variableConfig.model.js';
import { GetAllShipmentCosts } from '../models/shipmentCost.model.js';

/**
 * Retrieves a list of driver salaries for a specified month, year, and other optional filters such as driver code, status, and name.
 * This function calculates the total salary by summing up shipment costs and attendance salary, then applies filters and pagination.
 *
 * @param {Object} params - The parameters for retrieving driver salaries.
 * @param {number} params.month - The month for which to fetch the driver salaries (required).
 * @param {number} params.year - The year for which to fetch the driver salaries (required).
 * @param {number} [params.page_size] - The number of records per page (optional).
 * @param {number} [params.current] - The current page number for pagination (optional).
 * @param {string} [params.driver_code] - The specific driver code to filter the list (optional).
 * @param {string} [params.status] - The status filter for salaries (PENDING, CONFIRMED, PAID) (optional).
 * @param {string} [params.name] - The partial or full name of the driver to filter the list (optional).
 *
 * @returns {Object} An object containing the list of driver salaries, total rows, current page, and page size.
 * @returns {Array} returns.data - The array of driver salaries matching the filters.
 * @returns {number} returns.total_row - The total number of rows that match the filters.
 * @returns {number} returns.current - The current page number.
 * @returns {number} returns.page_size - The number of records per page.
 *
 * @throws {Error} If there is an error querying the driver salary data or if required parameters are missing.
 *
 * @example
 * const driverSalaries = await GetAllDriverSalaries({
 *   month: 12,
 *   year: 2024,
 *   page_size: 10,
 *   current: 1,
 *   driver_code: 'D001',
 *   status: 'PENDING',
 *   name: 'John'
 * });
 */

async function GetAllDriverSalaries({
  month,
  year,
  page_size,
  current,
  driver_code,
  status,
  name,
}) {
  try {
    let dataListDriverSalaries = [];

    // get data driver based on driver code and name
    const { drivers } = await GetAllDrivers({
      driver_code,
      name,
    });

    // if data driver is exist
    if (drivers && drivers.length) {
      // get data config for get attendance salary
      const variableConfig = await GetVariableConfig();
      const monthlyAttendanceSalary = variableConfig?.rows?.[0]?.value || 0;

      // loop per each driver
      for (const driver of drivers) {
        // get driver attendance based on driver code, month, and year
        const driverAttendances = await GetAllDriverAttendances({
          driver_code: driver.driver_code,
          month,
          year,
        });

        // calculate total attendance salary
        const totalAttendanceSalary =
          driverAttendances.totalRowCount * monthlyAttendanceSalary;

        // get data total shipment cost based on driver code, month, and year
        const {
          total_shipment_cost_pending = 0,
          total_shipment_cost_confirmed = 0,
          total_shipment_cost_paid = 0,
          total_shipment = 0,
        } = await GetAllShipmentCosts({
          driver_code: driver.driver_code,
          month,
          year,
        });

        // calculate total salary
        const totalSalary =
          total_shipment_cost_pending +
          total_shipment_cost_confirmed +
          total_shipment_cost_paid +
          totalAttendanceSalary;

        // if total salary is not more than 0, skip data
        if (totalSalary <= 0) continue;

        // push data to array
        dataListDriverSalaries.push({
          driver_code: driver.driver_code,
          name: driver.name,
          total_pending: total_shipment_cost_pending,
          total_confirmed: total_shipment_cost_confirmed,
          total_paid: total_shipment_cost_paid,
          total_attendance_salary: totalAttendanceSalary,
          total_salary: totalSalary,
          total_shipment,
        });
      }
    }

    // if filter status is used
    if (status) {
      // filter driver salaries based on status
      dataListDriverSalaries = dataListDriverSalaries.filter(
        (dataListDriverSalary) => {
          if (status === 'PENDING') {
            return dataListDriverSalary.total_pending > 0;
          } else if (status === 'CONFIRMED') {
            return dataListDriverSalary.total_confirmed > 0;
          } else if (status === 'PAID') {
            return (
              dataListDriverSalary.total_paid > 0 &&
              dataListDriverSalary.total_confirmed === 0 &&
              dataListDriverSalary.total_pending === 0
            );
          }
        }
      );
    }

    // define total row based on data found
    const totalRows = dataListDriverSalaries.length;

    // if page size and current page exist
    if (page_size && current) {
      // define start index for pagination
      const startIndex = (current - 1) * page_size;

      // define end index for pagination
      const endIndex = current * page_size;
      dataListDriverSalaries = dataListDriverSalaries.slice(
        startIndex,
        endIndex
      );
    }

    // return data
    return {
      data: dataListDriverSalaries,
      total_row: totalRows,
      current: page_size,
      page_size: current,
    };
  } catch (error) {
    console.error('Error querying GetAllDriverSalaries:', error.stack);
    throw new Error(`Error querying GetAllDriverSalaries: ${error.message}`);
  }
}

// export function
export { GetAllDriverSalaries };
