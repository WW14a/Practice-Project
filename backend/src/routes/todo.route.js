import express from "express";
import { validateSchema } from "../middleware/schemasValidation.middleware.js";
import { TodoScehema, UpdateTodoSchema } from "../schemas/todo.schema.js";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controller/todo.controller.js";
import { wrapasync } from "../utlis/wrapasync.js";
import { isValidTodo } from "../middleware/todo.middleware.js";

const router = express.Router();

router.post("/", validateSchema(TodoScehema), wrapasync(createTodo));
router.get("/", wrapasync(getTodos));
router.get("/:id", isValidTodo, wrapasync(getTodoById));
router.patch(
  "/:id",
  isValidTodo,
  validateSchema(UpdateTodoSchema),
  wrapasync(updateTodo),
);
router.delete("/:id", isValidTodo, wrapasync(deleteTodo));

export default router;
