import express from "express";
import {
  CreateUser,
  //   DeleteUser,
  LoginUser,
  //   LogoutUser,
  //   UpdateUser,
} from "../controllers/controller.js";
const router = express.Router();
router.post("/auth/register", CreateUser);
router.post("/auth/login", LoginUser);
// router.post("/", UpdateUser);
// router.post("/", LogoutUser);
// router.post("/", DeleteUser);

export default router;
