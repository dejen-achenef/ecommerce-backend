import prisma from "../lib/prisma.js";
import { cartRepository } from "../repositories/cartRepository.js";

export const cartService = {
  async getMyCart(userId) {
    await cartRepository.getOrCreateByUserId(userId);
    return cartRepository.getWithItems(userId);
  },
  async addItem(userId, productId, quantity = 1) {
    const cart = await cartRepository.getOrCreateByUserId(userId);
    // Validate product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    const qty = Math.max(1, Number(quantity || 1));
    await cartRepository.upsertItem(cart.id, productId, qty);
    return cartRepository.getWithItems(userId);
  },
  async updateItem(userId, productId, quantity) {
    const cart = await cartRepository.getOrCreateByUserId(userId);
    const qty = Math.max(1, Number(quantity));
    await cartRepository.upsertItem(cart.id, productId, qty);
    return cartRepository.getWithItems(userId);
  },
  async removeItem(userId, productId) {
    const cart = await cartRepository.getOrCreateByUserId(userId);
    await cartRepository.removeItem(cart.id, productId);
    return cartRepository.getWithItems(userId);
  },
  async clear(userId) {
    const cart = await cartRepository.getOrCreateByUserId(userId);
    await cartRepository.clear(cart.id);
    return cartRepository.getWithItems(userId);
  },
};
