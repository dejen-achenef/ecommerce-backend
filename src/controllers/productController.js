import { catalogService } from "../services/catalogService.js";
import { parsePagination } from "../utils/pagination.js";

export const productController = {
  list: async (req, res, next) => {
    try {
      const { page, pageSize, skip, take } = parsePagination(req.query);
      const { q, category, minPrice, maxPrice, sort } = req.query;
      const { items, total } = await catalogService.listProducts({
        skip,
        take,
        q,
        categorySlug: category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
      });
      res.json({ success: true, message: "Products", object: items, pageNumber: page, pageSize, totalSize: total });
    } catch (e) { next(e); }
  },
  get: async (req, res, next) => {
    try {
      const { slugOrId } = req.params;
      const prod = slugOrId.includes("-") ? await catalogService.getProductById(slugOrId) : await catalogService.getProductBySlug(slugOrId);
      if (!prod) return res.status(404).json({ success: false, message: "Product not found" });
      res.json({ success: true, message: "Product", object: prod });
    } catch (e) { next(e); }
  },
  create: async (req, res, next) => {
    try {
      const { name, slug, description, price, stock, categoryId, images } = req.body;
      const created = await catalogService.createProduct({
        name, slug, description, price, stock, categoryId,
        images: images?.length ? { create: images.map(i => ({ url: i.url, altText: i.altText || null, sortOrder: i.sortOrder || 0 })) } : undefined,
      });
      res.status(201).json({ success: true, message: "Product created", object: created });
    } catch (e) { next(e); }
  },
  update: async (req, res, next) => {
    try {
      const updated = await catalogService.updateProduct(req.params.id, req.body);
      res.json({ success: true, message: "Product updated", object: updated });
    } catch (e) { next(e); }
  },
  remove: async (req, res, next) => {
    try {
      await catalogService.deleteProduct(req.params.id);
      res.json({ success: true, message: "Product deleted" });
    } catch (e) { next(e); }
  },
};
