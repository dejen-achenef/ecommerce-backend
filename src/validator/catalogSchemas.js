import Joi from "joi";

export const categoryCreateSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  slug: Joi.string().lowercase().required(),
  description: Joi.string().allow("").optional(),
});

export const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(60),
  slug: Joi.string().lowercase(),
  description: Joi.string().allow("")
});

export const productCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().lowercase().required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).default(0),
  categoryId: Joi.string().uuid().optional(),
  images: Joi.array().items(
    Joi.object({ url: Joi.string().uri().required(), altText: Joi.string().allow(""), sortOrder: Joi.number().min(0) })
  ).optional(),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  slug: Joi.string().lowercase(),
  description: Joi.string().allow("") ,
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
  categoryId: Joi.string().uuid().optional(),
});
