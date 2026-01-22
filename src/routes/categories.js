import express from "express";
import { categoryController } from "../controllers/categoryController.js";
import { checkschemas } from "../middleware/shcemasvalidator.js";
import { categoryCreateSchema, categoryUpdateSchema } from "../validator/catalogSchemas.js";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { AdminChecker } from "../middleware/adminCheker.js";

const router = express.Router();

router.get("/", categoryController.list);
router.get("/:slugOrId", categoryController.get);
router.post("/", tokenChecker, AdminChecker, checkschemas(categoryCreateSchema), categoryController.create);
router.patch("/:id", tokenChecker, AdminChecker, checkschemas(categoryUpdateSchema), categoryController.update);
router.delete("/:id", tokenChecker, AdminChecker, categoryController.remove);

export default router;
