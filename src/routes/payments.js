import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { paymentController } from "../controllers/paymentController.js";

const router = express.Router();

router.use(tokenChecker);
router.post("/intent", paymentController.createIntent);
router.post("/webhook", express.json({ type: "application/json" }), paymentController.webhook);

export default router;
