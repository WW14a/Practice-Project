import express from "express";
import {
  createUser,
  Login,
  Logout,
  refreshToken,
} from "../controller/auth.controller.js";
import { wrapasync } from "../utlis/wrapasync.js";
import { isLogin } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/schemasValidation.middleware.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), wrapasync(createUser));
router.post("/login", validateSchema(loginSchema), wrapasync(Login));
router.post("/refresh", wrapasync(refreshToken));
router.post("/logout", isLogin, wrapasync(Logout));

export default router;
