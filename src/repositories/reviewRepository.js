import prisma from "../lib/prisma.js";

export const reviewRepository = {
  listByProduct: (productId, { skip, take }) => prisma.review.findMany({ where: { productId }, skip, take, orderBy: { createdAt: "desc" } }),
  create: (userId, productId, rating, comment) => prisma.review.create({ data: { userId, productId, rating, comment } }),
  update: (id, data) => prisma.review.update({ where: { id }, data }),
  remove: (id) => prisma.review.delete({ where: { id } }),
};
