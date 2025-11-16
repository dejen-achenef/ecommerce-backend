import express from "express";
import {
  addpost,
  CreateUser,
  //   DeleteUser,
  LoginUser,
  UpdatePost,
  //   LogoutUser,
  //   UpdateUser,
} from "../controllers/controller.js";

import { AdminChecker } from "../middleware/adminCheker.js";
import Joi from "joi";
import { userInputValidation } from "../validator/inputValidator.js";
import { checkschemas } from "../middleware/shcemasvalidator.js";

const router = express.Router();

router.post("/auth/register", checkschemas(userInputValidation), CreateUser);
router.post("/auth/login", LoginUser);
router.post("/add/post", AdminChecker, addpost);
router.patch("/update/post/:id", AdminChecker, UpdatePost);
// router.post("/", UpdateUser);
// router.post("/", LogoutUser);
// router.post("/", DeleteUser);

export default router;
