import prisma from "../lib/prisma.js";

export const shippingRepository = {
  list: () => prisma.shippingMethod.findMany({ where: { active: true }, orderBy: { price: "asc" } }),
  adminList: () => prisma.shippingMethod.findMany(),
  create: (data) => prisma.shippingMethod.create({ data }),
  update: (id, data) => prisma.shippingMethod.update({ where: { id }, data }),
  remove: (id) => prisma.shippingMethod.delete({ where: { id } }),
};
