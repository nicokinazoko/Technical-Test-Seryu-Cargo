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
  let dataListDriverSalaries = [];
  const { drivers } = await GetAllDrivers({
    driver_code,
    name,
  });

  if (drivers && drivers.length) {
    for (const driver of drivers) {
      const driverAttendances = await GetAllDriverAttendances({
        driver_code: driver.driver_code,
        month,
        year,
      });

      const variableConfig = await GetVariableConfig();
      const monthlyAttendanceSalary =
        variableConfig &&
        variableConfig.rows &&
        variableConfig.rows.length &&
        variableConfig.rows[0] &&
        variableConfig.rows[0].value;

      const totalAttendanceSalary =
        driverAttendances.totalRowCount * monthlyAttendanceSalary;

      const {
        total_shipment_cost_pending,
        total_shipment_cost_confirmed,
        total_shipment_cost_paid,
        total_shipment,
      } = await GetAllShipmentCosts({
        driver_code: driver.driver_code,
        month,
        year,
      });
      const totalShipmentCostPending = total_shipment_cost_pending
        ? total_shipment_cost_pending
        : 0;
      const totalShipmentCostConfirmed = total_shipment_cost_confirmed
        ? total_shipment_cost_confirmed
        : 0;

      const totalShipmentCostPaid = total_shipment_cost_paid
        ? total_shipment_cost_paid
        : 0;

      const totalSalary =
        totalShipmentCostPending +
        totalShipmentCostConfirmed +
        totalShipmentCostPaid +
        totalAttendanceSalary;

      dataListDriverSalaries.push({
        driver_code: driver.driver_code,
        name: driver.name,
        total_pending: totalShipmentCostPending,
        total_confirmed: totalShipmentCostConfirmed,
        total_paid: totalShipmentCostPaid,
        total_attendance_salary: totalAttendanceSalary,
        total_salary: totalSalary,
        total_shipment,
      });
    }
  }

  if (status) {
    if (status === 'PENDING') {
      dataListDriverSalaries = dataListDriverSalaries.filter(
        (dataListDriverSalary) => dataListDriverSalary.total_pending > 0
      );
    } else if (status === 'CONFIRMED') {
      dataListDriverSalaries = dataListDriverSalaries.filter(
        (dataListDriverSalary) => dataListDriverSalary.total_confirmed > 0
      );
    } else if (status === 'PAID') {
      dataListDriverSalaries = dataListDriverSalaries.filter(
        (dataListDriverSalary) =>
          dataListDriverSalary.total_paid > 0 &&
          dataListDriverSalary.total_confirmed === 0 &&
          dataListDriverSalary.total_pending === 0
      );
    }
  }

  let paginateDataListDriverSalaries;

  if (page_size && current) {
    const startIndex = (current - 1) * page_size;
    const endIndex = current * page_size;

    paginateDataListDriverSalaries = dataListDriverSalaries.slice(
      startIndex,
      endIndex
    );
  }

  return {
    data: paginateDataListDriverSalaries,
    total_row:
      dataListDriverSalaries && dataListDriverSalaries.length
        ? dataListDriverSalaries.length
        : 0,
    current: page_size,
    page_size: current,
  };
}

export { GetAllDriverSalaries };
