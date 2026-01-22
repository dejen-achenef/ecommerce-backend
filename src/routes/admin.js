import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { AdminChecker } from "../middleware/adminCheker.js";
import { adminController } from "../controllers/adminController.js";

const router = express.Router();
router.get("/metrics", tokenChecker, AdminChecker, adminController.metrics);
export default router;
