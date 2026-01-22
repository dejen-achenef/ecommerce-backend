import prisma from "../lib/prisma.js";
import { orderRepository } from "../repositories/orderRepository.js";
import { cartRepository } from "../repositories/cartRepository.js";

export const orderService = {
  async createOrderFromCart(userId, { addressId, shippingMethodId, discountCode } = {}) {
    const cart = await cartRepository.getWithItems(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      const err = new Error("Cart is empty");
      err.status = 400;
      throw err;
    }
    // Compute subtotal
    let subtotal = 0;
    const itemsData = [];
    for (const item of cart.items) {
      const price = item.product.price;
      subtotal += Number(price) * item.quantity;
      itemsData.push({ productId: item.productId, name: item.product.name, price, quantity: item.quantity });
    }

    // Shipping cost
    let shippingCost = 0;
    if (shippingMethodId) {
      const method = await prisma.shippingMethod.findUnique({ where: { id: shippingMethodId } });
      if (method) shippingCost = Number(method.price);
    }

    // Discount
    const { discountAmount, discount } = await (await import("./discountService.js")).discountService.validateAndCompute(discountCode, subtotal);

    const total = Math.max(0, subtotal + shippingCost - discountAmount);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({ data: { userId, total, shippingMethodId: shippingMethodId || null, shippingCost, addressId: addressId || null } });
      for (const it of itemsData) {
        await tx.orderItem.create({ data: { ...it, orderId: created.id } });
      }
      if (discount) {
        await tx.appliedDiscount.create({ data: { orderId: created.id, discountId: discount.id, amount: discountAmount } });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    return orderRepository.findById(order.id);
  },

  getMyOrders: (userId, { skip, take }) => orderRepository.listByUser(userId, { skip, take }),
  getOrderById: (id) => orderRepository.findById(id),
};
