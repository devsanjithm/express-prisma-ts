import express from 'express';
import deleteExpiredItems from '../../services/softDelete.service.js';
import responseHandler from '../../utils/response.js';

const router = express.Router();

router.get('/deleteSoftItems', (req, res) => {
  deleteExpiredItems();
  responseHandler(res, null);
});

export default router;
