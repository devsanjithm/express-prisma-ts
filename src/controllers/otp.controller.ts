import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as otpService from '../services/otp.service.js';
import responseHandler from '../utils/response.js';
import { userfromcache } from '../types/Auth/controller.js';

export const sendOtp = catchAsync(async (req, res) => {
  const { mobile_number } = req.body;
  const { user_id } = req.user as userfromcache;
  await otpService.createOtp(mobile_number, user_id);
  responseHandler(res, null, httpStatus.CREATED);
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { mobile_number, otp } = req.body;
  await otpService.verifyOtp(mobile_number, otp);
  responseHandler(res, null, httpStatus.OK);
});
