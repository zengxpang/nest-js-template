import { Prisma, PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';

export const extendedPrismaClient = new PrismaClient<
  Prisma.PrismaClientOptions,
  'query' | 'info' | 'warn' | 'error'
>({
  log: [
    {
      emit: 'stdout',
      level: 'query',
    },
  ],
}).$extends(
  pagination({
    pages: {
      limit: 20,
      includePageCount: true,
    },
  }),
);

export type ExtendedPrismaClient = typeof extendedPrismaClient;
