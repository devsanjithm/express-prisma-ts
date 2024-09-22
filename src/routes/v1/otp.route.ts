import express from 'express';
import validate from '../../middlewares/validate.js';
import * as OtpValidations from '../../validations/otp.validations.js';
import * as otpController from '../../controllers/otp.controller.js';

const router = express.Router();

router.route('/send').post(validate(OtpValidations.sendOtp), otpController.sendOtp);

router.route('/verify').post(validate(OtpValidations.verifyOtp), otpController.verifyOtp);

export default router;
