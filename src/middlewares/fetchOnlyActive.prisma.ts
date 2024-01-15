import { PrismaFindAction } from '../config/prismaActions.prisma';
import { Prisma } from '@prisma/client';
import * as Express from 'express';

const fetchOnlyActive: any = (params: Prisma.MiddlewareParams, next: Express.NextFunction) => {
  if (PrismaFindAction.includes(params.action)) {
    params.args.where = {
      ...params.args.where,
      deletedAt: null,
      is_active: true
    };
  }
  return next(params);
};
export default fetchOnlyActive;
