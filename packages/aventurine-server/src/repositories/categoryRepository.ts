import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const categoryRepository = {
  create: (data: any) => prisma.category.create({ data }),
  findAll: () => prisma.category.findMany(),
  findById: (id: number) => prisma.category.findUnique({ where: { id } }),
  update: (id: number, data: any) =>
    prisma.category.update({ where: { id }, data }),
  delete: (id: number) => prisma.category.delete({ where: { id } }),
};
