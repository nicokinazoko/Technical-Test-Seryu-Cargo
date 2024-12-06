// import functions
import { pool } from '../config/db.js';

/**
 * Retrieves the configuration data from the `variable_configs` table.
 *
 * @returns {Promise<Object>} - A promise that resolves to the variable configuration data.
 *   - The result will be an object containing the rows from the `variable_configs` table.
 *
 * @throws {Error} - If there is an error while querying the database.
 *
 * @example
 * // Example call
 * const config = await GetVariableConfig();
 * console.log(config); // Output the variable configurations
 */

async function GetVariableConfig() {
  try {
    // define main query for get all data
    let query = 'SELECT * FROM variable_configs ';

    // get all data variable config
    const variableConfig = await pool.query(query);

    // return variableConfig
    return variableConfig;
  } catch (error) {
    console.error('Error querying GetVariableConfig:', error.stack);
    throw new Error(`Error querying GetVariableConfig: ${error.message}`);
  }
}

// export functions
export { GetVariableConfig };
