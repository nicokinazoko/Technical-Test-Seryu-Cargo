import { pool } from '../config/db.js';
import { GetAllListDrivers } from '../services/salary.service.js';
import { GetAllDriverSalaries } from '../models/salary.model.js';
import { GetAllDrivers } from '../models/driver.model..js';

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

  if (drivers && drivers.length && totalRowCount >= 0) {
    for (const driver of drivers) {
      dataListDriverSalaries.push({
        driver_code: driver.driver_code,
        name: driver.name,
      });
      console.log(driver.name);
    }
  }

  res.json({
    data: dataListDriverSalaries,
    total_row: totalRowCount,
    current: +current,
    page_size: +page_size,
  });
}

export { GetDriverSalaryList };
