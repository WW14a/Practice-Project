import * as TodoService from "../services/todo.service.js";

export const getTodos = async (req, res) => {
  const userId = req.user._id;
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let search = req.query.search || "";
  page = Math.max(page, 1);
  limit = Math.min(Math.max(limit, 1), 100);
  const option = { page, limit, search };
  const todos = await TodoService.getTodos(userId, option);
  res.status(200).json({ success: true, data: todos });
};

export const createTodo = async (req, res) => {
  const userId = req.user._id;
  const todoData = { ...req.body, user: userId };
  const todo = await TodoService.createTodo(todoData);
  res.status(201).json({ success: true, data: todo });
};

export const getTodoById = async (req, res) => {
  const todoId = req.params.id;
  const todo = await TodoService.getTodoById(todoId);
  res.status(200).json({ success: true, data: todo });
};

export const updateTodo = async (req, res) => {
  const todoId = req.params.id;
  const updateData = req.body;
  const updatedTodo = await TodoService.updateTodo(todoId, updateData);
  res.status(200).json({ success: true, data: updatedTodo });
};

export const deleteTodo = async (req, res) => {
  const todoId = req.params.id;
  const deletedTodo = await TodoService.deleteTodo(todoId);
  res.status(200).json({ success: true, data: deletedTodo });
};
