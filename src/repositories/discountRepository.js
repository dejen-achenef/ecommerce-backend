import prisma from "../lib/prisma.js";

export const discountRepository = {
  findByCode: (code) => prisma.discount.findFirst({ where: { code, active: true, AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] }] } }),
  create: (data) => prisma.discount.create({ data }),
  update: (id, data) => prisma.discount.update({ where: { id }, data }),
  remove: (id) => prisma.discount.delete({ where: { id } }),
  list: () => prisma.discount.findMany(),
};
