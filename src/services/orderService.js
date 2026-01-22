import prisma from "../lib/prisma.js";
import { orderRepository } from "../repositories/orderRepository.js";
import { cartRepository } from "../repositories/cartRepository.js";

export const orderService = {
  async createOrderFromCart(userId) {
    const cart = await cartRepository.getWithItems(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      const err = new Error("Cart is empty");
      err.status = 400;
      throw err;
    }
    // Compute total
    let total = 0;
    const itemsData = [];
    for (const item of cart.items) {
      const price = item.product.price;
      total += Number(price) * item.quantity;
      itemsData.push({ productId: item.productId, name: item.product.name, price, quantity: item.quantity });
    }

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({ data: { userId, total } });
      for (const it of itemsData) {
        await tx.orderItem.create({ data: { ...it, orderId: created.id } });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    return orderRepository.findById(order.id);
  },

  getMyOrders: (userId, { skip, take }) => orderRepository.listByUser(userId, { skip, take }),
  getOrderById: (id) => orderRepository.findById(id),
};
