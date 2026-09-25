import express from "express";
import {
  deleteUser,
  getMe,
  UpdateUser,
  UpdateUserPassword,
} from "../controller/user.controller.js";
import { wrapasync } from "../utlis/wrapasync.js";
import { validateSchema } from "../middleware/schemasValidation.middleware.js";
import {
  updatePasswordSchema,
  updateUserSchema,
} from "../schemas/user.schema.js";

const router = express.Router();

router.get("/me", wrapasync(getMe));
router.patch("/", validateSchema(updateUserSchema), wrapasync(UpdateUser));
router.delete("/", wrapasync(deleteUser));
router.patch(
  "/password",
  validateSchema(updatePasswordSchema),
  wrapasync(UpdateUserPassword),
);

export default router;
