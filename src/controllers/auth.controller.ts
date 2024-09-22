import httpStatus from 'http-status';
import * as OtpService from '../services/otp.service.js';
import * as tokenService from '../services/token.service.js';
import { userService } from '../services/user.service.js';
import * as authService from '../services/auth.service.js';
import * as emailService from '../services/email.service.js';
import cacheService from '../services/cache.service.js';
import { type userfromcache } from '../types/Auth/controller.js';
import catchAsync from '../utils/catchAsync.js';
import responseHandler from '../utils/response.js';
import exclude from '../utils/exclude.js';
import ApiError from '../utils/ApiError.js';

export const register = catchAsync(async (req, res) => {
  const { email_address, password, mobile_number, first_name } = req.body;
  await userService.create({ email_address, password, first_name, mobile_number, roles: 'USER' });
  responseHandler(res, { message: 'User Created Successfully' }, httpStatus.CREATED);
});

export const login = catchAsync(async (req, res) => {
  const { mobile_no, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(mobile_no, password);
  await cacheService.setToCache(user.user_id, user);
  const token = await tokenService.generateAuthTokens({ user_id: user.user_id });
  return responseHandler(res, { user: user, token }, httpStatus.OK);
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

export const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  responseHandler(res, { ...tokens });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const users = await userService.list({ email_address: req.body.email_address });
  const user = users.length > 0 ? users[0] : null;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this Email address');
  }
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email_address);
  await emailService.sendResetPasswordEmail(req.body.email_address, resetPasswordToken);
  await OtpService.createOtp(req.body.mobile_number, user.user_id);
  responseHandler(res, { resetPasswordToken, user_id: user.user_id });
});

export const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

export const getUserData = catchAsync(async (req, res) => {
  const { user_id } = req.user as userfromcache;
  const user = await userService.get({ user_id: user_id });
  const santiziedUser = exclude(user, ['password']);
  await cacheService.setToCache(user.user_id, santiziedUser);
  responseHandler(res, { user: santiziedUser }, httpStatus.OK);
});

export const sendVerificationEmail = catchAsync(async (req, res) => {
  const user = req.user as userfromcache;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email_address, verifyEmailToken);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

export const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});
