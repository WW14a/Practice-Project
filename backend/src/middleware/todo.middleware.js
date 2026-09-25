import Todo from "../models/todo.model.js";

export const isValidTodo = async (req, res, next) => {
  const todo = await Todo.findById(req.params.id, { userId: req.user._id });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  next();
};
