import { GetAllListDrivers } from '../services/salary.service.js';
import { GetAllDrivers } from '../models/driver.model..js';
import { GetAllDriverAttendances } from '../models/driverAttendance.model.js';
import { GetVariableConfig } from '../models/variableConfig.model.js';
import { GetAllShipmentCosts } from '../models/shipmentCost.model.js';

async function GetDriverSalaryList(req, res) {
  const { month, year, page_size, current, driver_code, status, name } =
    req.query;

  if (!month) {
    return res.status(400).send({ error: 'Filter month is required' });
  }

  if (!year) {
    return res.status(400).send({ error: 'Filter year is required' });
  }

  const dataListDriverSalaries = [];

  const { drivers, totalRowCount } = await GetAllDrivers({
    driver_code,
    name,
    page_size,
    current,
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
      } = await GetAllShipmentCosts({
        driver_code: driver.driver_code,
        month,
        year,
      });

      const totalSalary =
        (total_shipment_cost_pending ? +total_shipment_cost_pending : 0) +
        (total_shipment_cost_confirmed ? +total_shipment_cost_confirmed : 0) +
        (total_shipment_cost_paid ? +total_shipment_cost_paid : 0) +
        totalAttendanceSalary;

      dataListDriverSalaries.push({
        driver_code: driver.driver_code,
        name: driver.name,
        total_pending: total_shipment_cost_pending
          ? +total_shipment_cost_pending
          : 0,
        total_confirmed: total_shipment_cost_confirmed
          ? +total_shipment_cost_confirmed
          : 0,
        total_paid: total_shipment_cost_paid ? +total_shipment_cost_paid : 0,
        total_attendance_salary: totalAttendanceSalary,
        total_salary: totalSalary,
      });
    }
  }

  res.json({
    data: dataListDriverSalaries,
    total_row: totalRowCount ? totalRowCount : 0,
    current: +current,
    page_size: +page_size,
  });
}

export { GetDriverSalaryList };
