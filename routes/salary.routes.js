import express from 'express';

import { GetDriverSalaryList } from '../controllers/salary.controller.js';

const router = express.Router();

router.get('/salary/driver/list', GetDriverSalaryList);

export default router;
