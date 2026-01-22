import prisma from "../lib/prisma.js";

export const cartRepository = {
  getOrCreateByUserId: async (userId) => {
    return prisma.cart.upsert({ where: { userId }, update: {}, create: { userId } });
  },
  getWithItems: (userId) =>
    prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: { include: { images: true } } } } } }),
  upsertItem: async (cartId, productId, quantity) => {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity },
      create: { cartId, productId, quantity },
    });
  },
  removeItem: (cartId, productId) => prisma.cartItem.delete({ where: { cartId_productId: { cartId, productId } } }),
  clear: (cartId) => prisma.cartItem.deleteMany({ where: { cartId } }),
};
