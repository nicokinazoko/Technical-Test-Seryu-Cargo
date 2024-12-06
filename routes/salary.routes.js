// import libraries
import express from 'express';

// import functions
import { GetDriverSalaryList } from '../controllers/salary.controller.js';

// define router from expres
const router = express.Router();

// set router for salary driver list using function
router.get('/salary/driver/list', GetDriverSalaryList);

// export route
export default router;
