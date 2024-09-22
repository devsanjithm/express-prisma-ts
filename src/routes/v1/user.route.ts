import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import * as userValidation from '../../validations/user.validation.js';
import { userController } from '../../controllers/user.controller.js';

const router = express.Router();

router.route('/').post(auth('manage'), validate(userValidation.list), userController.list);

router
  .route('/:user_id')
  .get(auth('get'), validate(userValidation.get), userController.get)
  .patch(auth('get'), validate(userValidation.update), userController.update)
  .delete(auth('manage'), validate(userValidation.deleteData), userController.delete);

export default router;
