import { pool } from '../config/db.js';

async function GetVariableConfig() {
  let query = 'SELECT * FROM variable_configs ';

  const variableConfig = await pool.query(query);
  return variableConfig;
}

export { GetVariableConfig };
