import Todo from "../models/todo.model.js";

export const createTodo = async (todoData) => {
  const todo = new Todo(todoData);
  return await todo.save();
};

export const getTodos = async (userId, option = {}) => {
  const { page = 1, limit = 10, search = "" } = option;

  const skip = (page - 1) * limit;
  const filter = {
    user: userId,
  };

  filter.$or = [
    {
      title: {
        $regex: search,
        $options: "i",
      },
    },
    {
      description: {
        $regex: search,
        $options: "i",
      },
    },
  ];

  const [todo, total] = await Promise.all([
    Todo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Todo.countDocuments(filter),
  ]);

  return {
    todo,
    total,
    page,
    limit,
  };
};

export const getTodoById = async (id) => {
  return await Todo.findById(id);
};

export const updateTodo = async (id, updateData) => {
  return await Todo.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteTodo = async (id) => {
  return await Todo.findByIdAndDelete(id);
};
