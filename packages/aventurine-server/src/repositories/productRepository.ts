import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const productRepository = {
  create: (data: any) => prisma.product.create({ data }),
  findAll: () => prisma.product.findMany(),
  findById: (id: number) => prisma.product.findUnique({ where: { id } }),
  update: (id: number, data: any) =>
    prisma.product.update({ where: { id }, data }),
  delete: (id: number) => prisma.product.delete({ where: { id } }),
};
