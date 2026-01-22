import prisma from "../lib/prisma.js";

export const wishlistRepository = {
  add: (userId, productId) => prisma.wishlistItem.create({ data: { userId, productId } }),
  remove: (userId, productId) => prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } }),
  list: (userId) => prisma.wishlistItem.findMany({ where: { userId }, include: { product: { include: { images: true } } } }),
};
