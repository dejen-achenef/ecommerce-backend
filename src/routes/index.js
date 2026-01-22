import express from "express";
import legacyRouter from "./routes.js";
import authRouter from "./auth.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/legacy", legacyRouter);

export default router;
