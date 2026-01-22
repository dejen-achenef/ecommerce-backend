import Joi from "joi";

export const productListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  q: Joi.string().max(200).optional(),
  category: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sort: Joi.string().valid("price_asc", "price_desc", "newest").optional(),
}).with("maxPrice", "minPrice");
