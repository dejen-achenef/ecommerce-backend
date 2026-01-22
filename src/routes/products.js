import express from "express";
import { productController } from "../controllers/productController.js";
import { checkschemas } from "../middleware/shcemasvalidator.js";
import { productCreateSchema, productUpdateSchema } from "../validator/catalogSchemas.js";
import { productListQuerySchema } from "../validator/querySchemas.js";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { AdminChecker } from "../middleware/adminCheker.js";
import { validateQuery } from "../middleware/queryValidator.js";

const router = express.Router();

router.get("/", validateQuery(productListQuerySchema), productController.list);
router.get("/:slugOrId", productController.get);
router.post("/", tokenChecker, AdminChecker, checkschemas(productCreateSchema), productController.create);
router.patch("/:id", tokenChecker, AdminChecker, checkschemas(productUpdateSchema), productController.update);
router.delete("/:id", tokenChecker, AdminChecker, productController.remove);

export default router;
