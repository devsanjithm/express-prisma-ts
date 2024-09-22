import httpStatus from 'http-status';
import * as prismaClient from '@prisma/client';
import * as response from '../types/response.js';
import * as encryptUtil from '../utils/encryption.js';
import ApiError from '../utils/ApiError.js';
import prisma from '../client.js';
import exclude from '../utils/exclude.js';
import { userService } from './user.service.js';
import * as tokenService from './token.service.js';

export const loginUserWithEmailAndPassword = async (
  email_address: string,
  password: string
): Promise<Omit<prismaClient.users, 'password' | 'id' | 'is_active' | 'deletedAt'>> => {
  const users = await userService.list({ email_address });
  const user = users.length > 0 ? users[0] : null;
  if (!user || !(await encryptUtil.isPasswordMatch(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email Unverified');
  }
  return exclude(user, ['password']);
};

export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await prisma.tokens.findFirst({
    where: {
      token: refreshToken,
      type: prismaClient.TokenType.REFRESH
    }
  });
  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  await prisma.tokens.delete({ where: { token_id: refreshTokenData.token_id } });
};

export const refreshAuth = async (refreshToken: string): Promise<response.AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(
      refreshToken,
      prismaClient.TokenType.REFRESH
    );
    const { user_id } = refreshTokenData;
    await prisma.tokens.delete({ where: { token_id: refreshTokenData.token_id } });
    return tokenService.generateAuthTokens({ user_id });
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

export const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
): Promise<void> => {
  try {
    const resetPasswordTokenData = await tokenService.verifyToken(
      resetPasswordToken,
      prismaClient.TokenType.RESET_PASSWORD
    );
    const users = await userService.list({ user_id: resetPasswordTokenData.user_id });
    const user = users.length > 0 ? users[0] : null;
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User Not found');
    }
    await userService.update({ user_id: user.user_id }, { password: newPassword });
    await prisma.tokens.deleteMany({
      where: { user_id: user.user_id, type: prismaClient.TokenType.RESET_PASSWORD }
    });
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

export const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenData = await tokenService.verifyToken(
      verifyEmailToken,
      prismaClient.TokenType.VERIFY_EMAIL
    );
    await prisma.tokens.deleteMany({
      where: { user_id: verifyEmailTokenData.user_id, type: prismaClient.TokenType.VERIFY_EMAIL }
    });
    // await userService.updateUserById(verifyEmailTokenData.user_id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
