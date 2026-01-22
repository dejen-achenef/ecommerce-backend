import prisma from "../lib/prisma.js";

export const addressRepository = {
  listByUser: (userId) => prisma.address.findMany({ where: { userId } }),
  create: (userId, data) => prisma.address.create({ data: { ...data, userId } }),
  update: (userId, id, data) => prisma.address.update({ where: { id }, data }),
  remove: (userId, id) => prisma.address.delete({ where: { id } }),
};
