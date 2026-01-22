import prisma from "../lib/prisma.js";

export const categoryRepository = {
  list: (opts = {}) => prisma.category.findMany({
    skip: opts.skip,
    take: opts.take,
    orderBy: opts.orderBy || { createdAt: "desc" },
  }),
  count: () => prisma.category.count(),
  findById: (id) => prisma.category.findUnique({ where: { id } }),
  findBySlug: (slug) => prisma.category.findUnique({ where: { slug } }),
  create: (data) => prisma.category.create({ data }),
  update: (id, data) => prisma.category.update({ where: { id }, data }),
  remove: (id) => prisma.category.delete({ where: { id } }),
};
