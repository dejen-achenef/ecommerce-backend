import express from "express";
import { authController } from "../controllers/authController.js";
import { checkschemas } from "../middleware/shcemasvalidator.js";
import { loginSchema, registerSchema } from "../validator/authSchemas.js";

const router = express.Router();

router.post("/register", checkschemas(registerSchema), authController.register);
router.post("/login", checkschemas(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
