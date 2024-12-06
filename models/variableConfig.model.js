import { pool } from '../config/db.js';

async function GetVariableConfig() {
  try {
    let query = 'SELECT * FROM variable_configs ';

    const variableConfig = await pool.query(query);
    return variableConfig;
  } catch (error) {
    console.error('Error querying GetVariableConfig:', error.stack);
    throw new Error(`Error querying GetVariableConfig: ${error.message}`);
  }
}

export { GetVariableConfig };
