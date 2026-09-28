import express from "express";
import {
  deleteUser,
  getMe,
  UpdateUser,
  UpdateUserPassword,
  uploadImage,
} from "../controller/user.controller.js";
import { wrapasync } from "../utlis/wrapasync.js";
import { validateSchema } from "../middleware/schemasValidation.middleware.js";
import {
  updatePasswordSchema,
  updateUserSchema,
} from "../schemas/user.schema.js";
import { isLogin } from "../middleware/auth.middleware.js";
import multer from "multer";
import { storage } from "../config/cloudinary.config.js";

const uplaod = multer({ storage });

const router = express.Router();

router.get("/me", isLogin, wrapasync(getMe));
router.patch(
  "/",
  isLogin,
  validateSchema(updateUserSchema),
  wrapasync(UpdateUser),
);
router.delete("/", wrapasync(deleteUser));
router.patch(
  "/password",
  isLogin,
  validateSchema(updatePasswordSchema),
  wrapasync(UpdateUserPassword),
);
router.post(
  "/uploadImage",
  isLogin,
  uplaod.single("image"),
  wrapasync(uploadImage),
);

export default router;
