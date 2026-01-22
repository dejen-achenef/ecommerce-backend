import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { reviewController } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId", reviewController.listForProduct);
router.post("/", tokenChecker, reviewController.add);
router.patch("/:id", tokenChecker, reviewController.update);
router.delete("/:id", tokenChecker, reviewController.remove);

export default router;
