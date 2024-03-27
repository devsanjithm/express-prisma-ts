import { Prisma, PrismaClient } from '@prisma/client';
import config from './config/config';

const xPrisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (
          (operation === 'findUnique' ||
            operation === 'findMany' ||
            operation === 'findFirst' ||
            operation === 'findFirstOrThrow' ||
            operation === 'update' ||
            operation === 'updateMany' ||
            operation === 'upsert' ||
            operation === 'findUniqueOrThrow') &&
          model !== 'softdeletedItems'
        ) {
          args.where = { ...args.where, deletedAt: null, is_active: true };
        }
        return query(args);
      }
    }
  },
  model: {
    $allModels: {
      async softDelete<T>(this: T, where: Prisma.Args<T, 'delete'>['where']) {
        const context = Prisma.getExtensionContext(this);
        const alteredQuery = await (context as any).update({
          where,
          data: {
            deletedAt: new Date(),
            is_active: false
          }
        });
        const modelId = (context.$name || '').slice(0, -1);
        await prisma.softdeletedItems.create({
          data: {
            item_id: alteredQuery[`${modelId}_id`],
            model_name: context.$name || ''
          }
        });
        return alteredQuery;
      },
      async softDeleteMany<T>(this: T, where: Prisma.Args<T, 'delete'>['where']) {
        const context = Prisma.getExtensionContext(this);
        const alteredQuery = await (context as any).updateMany({
          where,
          data: {
            deletedAt: new Date(),
            is_active: false
          }
        });
        const modelId = (context.$name || '').slice(0, -1);
        alteredQuery.map(async (el: any) => {
          await prisma.softdeletedItems.createMany({
            data: {
              item_id: el[`${modelId}_id`],
              model_name: context.$name || ''
            }
          });
        });
        return alteredQuery;
      }
    }
  }
});

type extendedPrisma = typeof xPrisma;

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends Global {
  prisma: extendedPrisma;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || xPrisma;

if (config.env === 'development') global.prisma = prisma;

export default prisma;
