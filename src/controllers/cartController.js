import { cartService } from "../services/cartService.js";

export const cartController = {
  getMyCart: async (req, res, next) => {
    try {
      const cart = await cartService.getMyCart(req.user.id);
      res.json({ success: true, message: "Cart", object: cart });
    } catch (e) { next(e); }
  },
  addItem: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addItem(req.user.id, productId, quantity);
      res.status(201).json({ success: true, message: "Item added", object: cart });
    } catch (e) { next(e); }
  },
  updateItem: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.updateItem(req.user.id, productId, quantity);
      res.json({ success: true, message: "Item updated", object: cart });
    } catch (e) { next(e); }
  },
  removeItem: async (req, res, next) => {
    try {
      const { productId } = req.body;
      const cart = await cartService.removeItem(req.user.id, productId);
      res.json({ success: true, message: "Item removed", object: cart });
    } catch (e) { next(e); }
  },
  clear: async (req, res, next) => {
    try {
      const cart = await cartService.clear(req.user.id);
      res.json({ success: true, message: "Cart cleared", object: cart });
    } catch (e) { next(e); }
  },
};
