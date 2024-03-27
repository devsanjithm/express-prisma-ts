import express from 'express';
import deleteExpiredItems from '../../services/softDelete.service';
import responseHandler from '../../utils/response';

const router = express.Router();

router.get('/deleteSoftItems', (req, res) => {
  deleteExpiredItems();
  responseHandler(res, null);
});

export default router;
