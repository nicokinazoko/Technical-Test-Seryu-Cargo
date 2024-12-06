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
  res.send('hello world');
});

app.listen(3000);
