import passport from 'passport';
import httpStatus from 'http-status';
import { type NextFunction, type Request, type Response } from 'express';
import { type users } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import { roleRights } from '../config/roles.js';

const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[]
  ) =>
  async (error: unknown, user: users | false, info: unknown) => {
    if (error || info || !user) {
      reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      return;
    }

    req.user = user;

    if (requiredRights.length > 0) {
      const userRights = roleRights.get(user.roles) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );

      if (!hasRequiredRights && req.params.userId !== user.user_id) {
        reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        return;
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => {
        next();
      })
      .catch((error) => {
        next(error);
      });

export default auth;
