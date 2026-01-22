import express from "express";
import { tokenChecker } from "../middleware/authMiddleWare.js";
import { addressController } from "../controllers/addressController.js";

const router = express.Router();
router.use(tokenChecker);
router.get("/", addressController.list);
router.post("/", addressController.create);
router.patch("/:id", addressController.update);
router.delete("/:id", addressController.remove);
export default router;
