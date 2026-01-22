import express from "express";
import legacyRouter from "./routes.js";
import authRouter from "./auth.js";
import productRouter from "./products.js";
import categoryRouter from "./categories.js";
import docsRouter from "./docs.js";
import cartRouter from "./cart.js";
import orderRouter from "./orders.js";
import paymentRouter from "./payments.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/payments", paymentRouter);
router.use("/addresses", (await import("./addresses.js")).default);
router.use("/shipping-methods", (await import("./shippingMethods.js")).default);
router.use("/admin", (await import("./admin.js")).default);
router.use("/docs", docsRouter);
router.use("/reviews", (await import("./reviews.js")).default);
router.use("/wishlist", (await import("./wishlist.js")).default);
router.use("/search", (await import("./search.js")).default);
router.use("/legacy", legacyRouter);

export default router;
