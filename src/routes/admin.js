import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { AdminChecker } from "../middleware/adminCheker.js";
import { adminController } from "../controllers/adminController.js";

const router = express.Router();
router.get("/metrics", tokenChecker, AdminChecker, adminController.metricsOverview);
router.get("/metrics/overview", tokenChecker, AdminChecker, adminController.metricsOverview);
router.get("/metrics/orders-by-status", tokenChecker, AdminChecker, adminController.ordersByStatus);
router.get("/metrics/sales-by-day", tokenChecker, AdminChecker, adminController.salesByDay);
router.get("/metrics/top-products", tokenChecker, AdminChecker, adminController.topProducts);
export default router;
