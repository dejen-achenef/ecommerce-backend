import { catalogService } from "../services/catalogService.js";
import { parsePagination } from "../utils/pagination.js";

export const categoryController = {
  list: async (req, res, next) => {
    try {
      const { skip, take, page, pageSize } = parsePagination(req.query);
      const { items, total } = await catalogService.listCategories({ skip, take });
      res.json({ success: true, message: "Categories", object: items, pageNumber: page, pageSize, totalSize: total });
    } catch (e) { next(e); }
  },
  get: async (req, res, next) => {
    try {
      const { slugOrId } = req.params;
      const cat = slugOrId.includes("-") ? await catalogService.getCategoryById(slugOrId) : await catalogService.getCategoryBySlug(slugOrId);
      if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
      res.json({ success: true, message: "Category", object: cat });
    } catch (e) { next(e); }
  },
  create: async (req, res, next) => {
    try {
      const created = await catalogService.createCategory(req.body);
      res.status(201).json({ success: true, message: "Category created", object: created });
    } catch (e) { next(e); }
  },
  update: async (req, res, next) => {
    try {
      const updated = await catalogService.updateCategory(req.params.id, req.body);
      res.json({ success: true, message: "Category updated", object: updated });
    } catch (e) { next(e); }
  },
  remove: async (req, res, next) => {
    try {
      await catalogService.deleteCategory(req.params.id);
      res.json({ success: true, message: "Category deleted" });
    } catch (e) { next(e); }
  },
};
