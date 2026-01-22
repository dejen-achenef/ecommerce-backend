import express from "express";
import legacyRouter from "./routes.js";
import authRouter from "./auth.js";
import productRouter from "./products.js";
import categoryRouter from "./categories.js";
import docsRouter from "./docs.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/docs", docsRouter);
router.use("/legacy", legacyRouter);

export default router;
