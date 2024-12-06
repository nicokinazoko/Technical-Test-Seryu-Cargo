// import functions
import { GetAllDriverSalaries } from '../services/salary.service.js';

/**
 * Controller function to handle the API request for retrieving the list of driver salaries.
 * This function processes the request query parameters, validates them, and calls the `GetAllDriverSalaries` function
 * to fetch the required data, then returns the response in JSON format.
 *
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used to send the response.
 *
 * @returns {void} - The function does not return a value. It sends the result or an error response directly to the client.
 *
 * @throws {Error} If there is an error while processing the request or querying the data.
 *
 * @example
 * // Example URL: GET /salary/driver/list?month=12&year=2024&page_size=10&current=1
 * const response = await GetDriverSalaryList(req, res);
 */

async function GetDriverSalaryList(req, res) {
  try {
    // define query from request
    const { month, year, page_size, current, driver_code, status, name } =
      req.query;

    // validation if query month not exist, then throw error
    if (!month) {
      return res.status(400).send({ error: 'Filter month is required' });
    }

    // validation if query year not exist, then throw error
    if (!year) {
      return res.status(400).send({ error: 'Filter year is required' });
    }

    // set current page to number
    const currentPage = +current;

    // set limit to number
    const limit = +page_size;

    // validation if current page is less than 0, then throw error
    if (currentPage <= 0) {
      return res.status(400).json({
        error:
          'Invalid page number. Page must be a positive integer and more than one',
      });
    }

    // validation if limit is less than 0, then throw error
    if (limit <= 0) {
      return res.status(400).json({
        error:
          'Invalid total page. Total page must be a positive integer and more than one',
      });
    }

    // call service to get all driver salaries
    const driverSalaries = await GetAllDriverSalaries({
      month,
      year,
      page_size: limit,
      current: currentPage,
      driver_code,
      status,
      name,
    });

    // return respon json based on service
    res.json(driverSalaries);
  } catch (error) {
    console.error(`Error get driver salary list : ${error.stack}`);
    return res
      .status(500)
      .send({ error: `Error get driver salary list :${error.message} ` });
  }
}

export { GetDriverSalaryList };
