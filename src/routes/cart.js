import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { cartController } from "../controllers/cartController.js";

const router = express.Router();

router.use(tokenChecker);
router.get("/me", cartController.getMyCart);
router.post("/items", cartController.addItem);
router.patch("/items", cartController.updateItem);
router.delete("/items", cartController.removeItem);
router.post("/clear", cartController.clear);

export default router;
