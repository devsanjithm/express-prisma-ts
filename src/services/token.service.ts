import { type tokens, TokenType } from '@prisma/client';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment, { type Moment } from 'moment';
import prisma from '../client.js';
import config from '../config/config.js';
import { type AuthTokensResponse } from '../types/response.js';
import ApiError from '../utils/ApiError.js';
import { userService } from './user.service.js';

export const generateToken = (
  user_id: string,
  expires: Moment,
  type: TokenType,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: user_id,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };
  return jwt.sign(payload, secret);
};

export const saveToken = async (
  token: string,
  user_id: string,
  expires: Moment,
  type: TokenType
): Promise<tokens> => {
  const createdToken = prisma.tokens.create({
    data: {
      token,
      user_id,
      expires: expires.toDate(),
      type
    }
  });
  return createdToken;
};

export const verifyToken = async (token: string, type: TokenType): Promise<tokens> => {
  const payload = jwt.verify(token, config.jwt.secret);
  const user_id = payload.sub?.toString();
  const tokenData = await prisma.tokens.findFirst({
    where: { token, type, user_id }
  });
  if (!tokenData) {
    throw new Error('Token not found');
  }

  return tokenData;
};

export const generateAuthTokens = async (user: {
  user_id: string;
}): Promise<AuthTokensResponse> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'days');
  const accessToken = generateToken(user.user_id, accessTokenExpires, TokenType.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.user_id, refreshTokenExpires, TokenType.REFRESH);
  await saveToken(refreshToken, user.user_id, refreshTokenExpires, TokenType.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

export const generateResetPasswordToken = async (email_address: string): Promise<string> => {
  const users = await userService.list({ email_address });
  const user = users.length > 0 ? users[0] : null;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this Mobile number');
  }

  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.user_id, expires, TokenType.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.user_id, expires, TokenType.RESET_PASSWORD);
  return resetPasswordToken;
};

export const generateVerifyEmailToken = async (user: { user_id: string }): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.user_id, expires, TokenType.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.user_id, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};
