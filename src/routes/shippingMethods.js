import express from "express";
import { shippingController } from "../controllers/shippingController.js";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { AdminChecker } from "../middleware/adminCheker.js";

const router = express.Router();
router.get("/", shippingController.list);
router.get("/admin", tokenChecker, AdminChecker, shippingController.adminList);
router.post("/", tokenChecker, AdminChecker, shippingController.create);
router.patch("/:id", tokenChecker, AdminChecker, shippingController.update);
router.delete("/:id", tokenChecker, AdminChecker, shippingController.remove);
export default router;
