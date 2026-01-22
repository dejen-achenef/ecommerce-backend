import { reviewRepository } from "../repositories/reviewRepository.js";
import { parsePagination } from "../utils/pagination.js";

export const reviewController = {
  listForProduct: async (req, res, next) => {
    try {
      const { page, pageSize, skip, take } = parsePagination(req.query);
      const reviews = await reviewRepository.listByProduct(req.params.productId, { skip, take });
      res.json({ success: true, message: "Reviews", object: reviews, pageNumber: page, pageSize, totalSize: reviews.length });
    } catch (e) { next(e); }
  },
  add: async (req, res, next) => {
    try {
      const { productId, rating, comment } = req.body;
      const created = await reviewRepository.create(req.user.id, productId, rating, comment);
      res.status(201).json({ success: true, message: "Review added", object: created });
    } catch (e) { next(e); }
  },
  update: async (req, res, next) => {
    try {
      const updated = await reviewRepository.update(req.params.id, req.body);
      res.json({ success: true, message: "Review updated", object: updated });
    } catch (e) { next(e); }
  },
  remove: async (req, res, next) => {
    try {
      await reviewRepository.remove(req.params.id);
      res.json({ success: true, message: "Review removed" });
    } catch (e) { next(e); }
  },
};
