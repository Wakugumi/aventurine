import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const profileRepository = {
  create: (data: any) => prisma.profile.create({ data }),
  findAll: () => prisma.profile.findMany(),
  findById: (id: number) => prisma.profile.findUnique({ where: { id } }),
  update: (id: number, data: any) =>
    prisma.profile.update({ where: { id }, data }),
  delete: (id: number) => prisma.profile.delete({ where: { id } }),
};
