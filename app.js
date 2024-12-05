import { pool } from './config/db.js';

import express from 'express';

import SalaryRoutes from './route/salary.routes.js';

const app = express();

app.use(express.json());

app.use('/v1', SalaryRoutes);

app.get('/', (req, res) => {
  console.log('masuk');
  res.send('hello world');
});

app.listen(3000);
