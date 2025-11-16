import express from "express";
import {
  addpost,
  CreateUser,
  DeleteProduct,
  getAllUser,
  getPostIndividually,
  //   DeleteUser,
  LoginUser,
  searchUser,
  UpdatePost,
  //   LogoutUser,
  //   UpdateUser,
} from "../controllers/controller.js";

import { AdminChecker } from "../middleware/adminCheker.js";
import Joi from "joi";
import { userInputValidation } from "../validator/inputValidator.js";
import { checkschemas } from "../middleware/shcemasvalidator.js";
import { checkUserByid } from "../middleware/getCheker.js";

const router = express.Router();

router.post("/auth/register", checkschemas(userInputValidation), CreateUser);
router.post("/auth/login", LoginUser);
router.post("/add/post", AdminChecker, addpost);
router.get("/get/posts", getAllUser);
router.get("/get/posts/search", searchUser);
router.delete("/post/delete/:id", AdminChecker, checkUserByid, DeleteProduct);
router.get("/get/posts/:id", getPostIndividually);

router.patch("/update/post/:id", AdminChecker, UpdatePost);
// router.post("/", UpdateUser);
// router.post("/", LogoutUser);
// router.post("/", DeleteUser);

export default router;
