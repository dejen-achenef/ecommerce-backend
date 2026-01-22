import { wishlistRepository } from "../repositories/wishlistRepository.js";

export const wishlistController = {
  add: async (req, res, next) => {
    try { const item = await wishlistRepository.add(req.user.id, req.body.productId); res.status(201).json({ success: true, message: "Added to wishlist", object: item }); } catch (e) { next(e); }
  },
  remove: async (req, res, next) => {
    try { await wishlistRepository.remove(req.user.id, req.body.productId); res.json({ success: true, message: "Removed from wishlist" }); } catch (e) { next(e); }
  },
  list: async (req, res, next) => {
    try { const items = await wishlistRepository.list(req.user.id); res.json({ success: true, message: "Wishlist", object: items }); } catch (e) { next(e); }
  },
};
