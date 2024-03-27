import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import exclude from '../utils/exclude';
import { users } from '@prisma/client';
import responseHandler from '../utils/response';
import cacheService from '../services/cache.service';

const register = catchAsync(async (req, res) => {
  const { email_address, password, username } = req.body;
  const user = await userService.createUser(email_address, password, username);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user);
  responseHandler(res, { user: userWithoutPassword, tokens }, httpStatus.CREATED);
});

const login = catchAsync(async (req, res) => {
  const { email_address, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email_address, password);
  await cacheService.setToCache(user.user_id, {
    id: user.user_id,
    email_address: user.email_address,
    first_name: user.first_name,
    roles: user.roles
  });
  const tokens = await tokenService.generateAuthTokens(user);
  responseHandler(res, { user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  responseHandler(res, { ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email_address);
  await emailService.sendResetPasswordEmail(req.body.email_address, resetPasswordToken);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const user = req.user as users;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email_address, verifyEmailToken);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  responseHandler(res, null, httpStatus.NO_CONTENT);
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
