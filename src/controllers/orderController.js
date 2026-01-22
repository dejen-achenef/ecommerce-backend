import { orderService } from "../services/orderService.js";
import { parsePagination } from "../utils/pagination.js";

export const orderController = {
  createFromCart: async (req, res, next) => {
    try {
      const { addressId, shippingMethodId, discountCode } = req.body || {};
      const order = await orderService.createOrderFromCart(req.user.id, { addressId, shippingMethodId, discountCode });
      res.status(201).json({ success: true, message: "Order created", object: order });
    } catch (e) { next(e); }
  },
  getMyOrders: async (req, res, next) => {
    try {
      const { page, pageSize, skip, take } = parsePagination(req.query);
      const orders = await orderService.getMyOrders(req.user.id, { skip, take });
      res.json({ success: true, message: "Orders", object: orders, pageNumber: page, pageSize, totalSize: orders.length });
    } catch (e) { next(e); }
  },
  getById: async (req, res, next) => {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      res.json({ success: true, message: "Order", object: order });
    } catch (e) { next(e); }
  },
};
