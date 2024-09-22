import express from 'express';
import * as authController from '../../controllers/auth.controller.js';
import validate from '../../middlewares/validate.js';
import * as authValidation from '../../validations/auth.validation.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post(
  '/refresh-tokens',
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);
router.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

router.route('/get-data').get(auth('getUsers'), authController.getUserData);

router.post('/send-verification-email', authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;
