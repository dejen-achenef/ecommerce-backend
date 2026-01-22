import { categoryRepository } from "../repositories/categoryRepository.js";
import { productRepository } from "../repositories/productRepository.js";

export const catalogService = {
  // Categories
  async listCategories({ skip, take }) {
    const [items, total] = await Promise.all([
      categoryRepository.list({ skip, take }),
      categoryRepository.count(),
    ]);
    return { items, total };
  },
  getCategoryBySlug: (slug) => categoryRepository.findBySlug(slug),
  getCategoryById: (id) => categoryRepository.findById(id),
  createCategory: (data) => categoryRepository.create(data),
  updateCategory: (id, data) => categoryRepository.update(id, data),
  deleteCategory: (id) => categoryRepository.remove(id),

  // Products
  listProducts: (opts) => productRepository.list(opts),
  getProductBySlug: (slug) => productRepository.findBySlug(slug),
  getProductById: (id) => productRepository.findById(id),
  createProduct: (data) => productRepository.create(data),
  updateProduct: (id, data) => productRepository.update(id, data),
  deleteProduct: (id) => productRepository.remove(id),
};
