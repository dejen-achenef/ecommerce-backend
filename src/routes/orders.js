import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { orderController } from "../controllers/orderController.js";

const router = express.Router();

router.use(tokenChecker);
router.post("/from-cart", orderController.createFromCart);
router.get("/me", orderController.getMyOrders);
router.get("/:id", orderController.getById);

export default router;
