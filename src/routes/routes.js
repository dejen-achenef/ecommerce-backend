import express from "express";
import {
  addpost,
  CreateUser,
  //   DeleteUser,
  LoginUser,
  //   LogoutUser,
  //   UpdateUser,
} from "../controllers/controller.js";

import { AdminChecker } from "../middleware/adminCheker.js";

const router = express.Router();

router.post("/auth/register", CreateUser);
router.post("/auth/login", LoginUser);
router.post("/add/post", AdminChecker, addpost);
// router.post("/", UpdateUser);
// router.post("/", LogoutUser);
// router.post("/", DeleteUser);

export default router;
