import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const transactionHeaderRepository = {
  create: (data: any) => prisma.transactionHeader.create({ data }),
  findAll: () =>
    prisma.transactionHeader.findMany({ include: { details: true } }),
  findById: (pk: number) =>
    prisma.transactionHeader.findUnique({
      where: { pk },
      include: { details: true },
    }),
  update: (pk: number, data: any) =>
    prisma.transactionHeader.update({ where: { pk }, data }),
  delete: (pk: number) => prisma.transactionHeader.delete({ where: { pk } }),
};
