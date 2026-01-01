import { json } from "express";
import Joi from "joi";
import joi from "joi";

export const userInputValidation = joi.object({
  email: joi.string().email().required(),
  role: joi.string().required(),
  name: joi.string().min(2).max(50).required(),
  password: joi
    .string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      "string.min": "Password must be at least 8 characters long",
    }),
});
export const LoginValidation = joi.object({
  email: joi.string().email(),
  name: joi.string().min(2).max(50),
  password: joi
    .string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      "string.min": "Password must be at least 8 characters long",
    }),
});

export const addPostValidation = joi
  .object({
    name: joi.string().min(2).max(100).required(),
    description: joi.string().min(10).required(),
    price: joi.number().required().min(1),
    stock: joi.number().required().min(0),
  })
  .unknown(true);
export const UpdatePostValidation = joi
  .object({
    name: joi.string().min(2).max(100),
    description: joi.string().min(10),
    price: joi.number().min(1),
    stock: joi.number().min(0),
  })
  .unknown(true);

export const emailValidatorForMiddleware = Joi.object({
  email: Joi.string().email().required(),
});

export const PlaceOrderValidation = Joi.array()
  .items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().min(1),
    }).unknown(true)
  )
  .min(1);
