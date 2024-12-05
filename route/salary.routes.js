import express from 'express';

const router = express.Router();

router.get('/salary/driver/list', (req, res) => {
  console.log('masuk');
  res.send('hello world');
});

export default router;
