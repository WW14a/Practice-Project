import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  priority: {
    type: String,
    enum: {
      values: ["low", "medium", "high"],
      message: "Priority must be either low, medium, or high",
    },
    default: "medium",
  },
  description: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
