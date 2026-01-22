import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { wishlistController } from "../controllers/wishlistController.js";

const router = express.Router();

router.use(tokenChecker);
router.get("/", wishlistController.list);
router.post("/", wishlistController.add);
router.delete("/", wishlistController.remove);

export default router;
