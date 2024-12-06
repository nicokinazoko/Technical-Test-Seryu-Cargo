import { GetAllDriverSalaries } from '../services/salary.service.js';

async function GetDriverSalaryList(req, res) {
  try {
    const { month, year, page_size, current, driver_code, status, name } =
      req.query;

    if (!month) {
      return res.status(400).send({ error: 'Filter month is required' });
    }

    if (!year) {
      return res.status(400).send({ error: 'Filter year is required' });
    }
    const currentPage = +current;
    const limit = +page_size;

    if (currentPage <= 0) {
      return res.status(400).json({
        error:
          'Invalid page number. Page must be a positive integer and more than one',
      });
    }

    if (limit <= 0) {
      return res.status(400).json({
        error:
          'Invalid total page. Total page must be a positive integer and more than one',
      });
    }

    const driverSalaries = await GetAllDriverSalaries({
      month,
      year,
      page_size: limit,
      current: currentPage,
      driver_code,
      status,
      name,
    });

    res.json(driverSalaries);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ error: `Error get driver salary list :${error.message} ` });
  }
}

export { GetDriverSalaryList };
