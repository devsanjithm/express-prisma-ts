import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

const returnFormatedObject = (arr: Array<{ item_id: string; model_name: string }>) => {
  const obj: any = {};
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    let ids = [element.item_id];
    if (obj[element.model_name]) {
      ids = [...ids, element.item_id];
    }
    obj[element.model_name] = ids;
  }
  return obj;
};

const deleteExpiredItems = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const wantToDeletedItems = await prisma.softdeletedItems.findMany({
    where: {
      createdAt: {
        lte: new Date(),
        gte: oneWeekAgo
      }
    },
    select: {
      item_id: true,
      model_name: true
    }
  });
  const deleteItemContainString = returnFormatedObject(wantToDeletedItems);
  const prismaPromise: any = [];
  try {
    Object.entries(deleteItemContainString).map(async ([key, value]) => {
      const modelName: Prisma.ModelName = key as any;
      const fieldName = `${key.slice(0, -1)}_id`;
      prismaPromise.push(
        (prisma[modelName] as any).deleteMany({
          where: {
            [fieldName]: {
              in: value
            }
          }
        })
      );
    });
    await prisma.$transaction(prismaPromise);
    logger.info('Deleted Soft Items done successfully');
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, JSON.stringify(error));
  }
};
export default deleteExpiredItems;
