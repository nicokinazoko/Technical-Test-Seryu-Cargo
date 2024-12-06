import { pool } from './config/db.js';

import { GetAllShipments } from './models/shipment.model.js';

import { GetAllShipmentCosts } from './models/shipmentCost.model.js';

import { GetAllDrivers } from './models/driver.model..js';

import express from 'express';

import SalaryRoutes from './routes/salary.routes.js';

const app = express();

app.use(express.json());

app.use('/v1', SalaryRoutes);

app.get('/', (req, res) => {
  console.log('masuk');
  res.send('hello world');
});

app.get('/test', async function (req, res) {
  const { month, year } = req.query;

  if (!month) {
    return res.status(400).send({ error: 'Filter month is required' });
  }

  if (!year) {
    return res.status(400).send({ error: 'Filter year is required' });
  }

  const result = await GetAllShipments({ month, year });

  res.json(result);
});

app.get('/drivers', async function (req, res) {
  const { driver_code, name } = req.query;
  const driver_codes = ['DRIVER003', 'DRIVER004'];
  const result = await GetAllDrivers({
    driver_code,
    name,
    driver_codes,
  });

  res.json(result);
});

app.listen(3000);
