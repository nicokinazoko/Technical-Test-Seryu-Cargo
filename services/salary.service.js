import { GetAllDrivers } from '../models/driver.model..js';
import { GetAllDriverAttendances } from '../models/driverAttendance.model.js';
import { GetVariableConfig } from '../models/variableConfig.model.js';
import { GetAllShipmentCosts } from '../models/shipmentCost.model.js';

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
    const { drivers } = await GetAllDrivers({
      driver_code,
      name,
    });

    if (drivers && drivers.length) {
      const variableConfig = await GetVariableConfig();
      const monthlyAttendanceSalary = variableConfig?.rows?.[0]?.value || 0;

      for (const driver of drivers) {
        const driverAttendances = await GetAllDriverAttendances({
          driver_code: driver.driver_code,
          month,
          year,
        });

        const totalAttendanceSalary =
          driverAttendances.totalRowCount * monthlyAttendanceSalary;

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

        const totalSalary =
          total_shipment_cost_pending +
          total_shipment_cost_confirmed +
          total_shipment_cost_paid +
          totalAttendanceSalary;

        if (totalSalary <= 0) continue;

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

    if (status) {
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

    const totalRows = dataListDriverSalaries.length;

    if (page_size && current) {
      const startIndex = (current - 1) * page_size;
      const endIndex = current * page_size;
      dataListDriverSalaries = dataListDriverSalaries.slice(
        startIndex,
        endIndex
      );
    }

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

export { GetAllDriverSalaries };
