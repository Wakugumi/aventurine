import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const transactionDetailRepository = {
  create: (data: any) => prisma.transactionDetail.create({ data }),
  findAll: () => prisma.transactionDetail.findMany(),
  findById: (id: number) => prisma.transactionDetail.findUnique({ where: { id } }),
  update: (id: number, data: any) =>
    prisma.transactionDetail.update({ where: { id }, data }),
  delete: (id: number) => prisma.transactionDetail.delete({ where: { id } }),
};
