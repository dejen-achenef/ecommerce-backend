import express from "express";
import { productRepository } from "../repositories/productRepository.js";
import { parsePagination } from "../utils/pagination.js";

const router = express.Router();

router.get("/products", async (req, res, next) => {
  try {
    const { page, pageSize, skip, take } = parsePagination(req.query);
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Missing q" });
    const items = await productRepository.searchFTS(q, { skip, take });
    res.json({ success: true, message: "Search results", object: items, pageNumber: page, pageSize, totalSize: items.length });
  } catch (e) { next(e); }
});

export default router;
