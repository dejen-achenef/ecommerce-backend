import prisma from "../lib/prisma.js";

export const orderRepository = {
  create: (data) => prisma.order.create({ data, include: { items: true, payment: true } }),
  findById: (id) => prisma.order.findUnique({ where: { id }, include: { items: true, payment: true } }),
  listByUser: (userId, opts = {}) =>
    prisma.order.findMany({ where: { userId }, skip: opts.skip, take: opts.take, orderBy: { createdAt: "desc" }, include: { items: true, payment: true } }),
};
