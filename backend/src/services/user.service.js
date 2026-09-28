import Session from "../models/session.model.js";
import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const userDetails = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ExpressError("User not found");
  }

  const sessions = await Session.find({ userId: id, revokedAt: null });
  const countTodo = await Todo.countDocuments({ user: id });
  const countCompletedTodo = await Todo.countDocuments({
    user: id,
    completed: true,
  });

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
    todoCount: countTodo,
    completedTodo: countCompletedTodo,
    sessions: sessions.map((session) => ({
      id: session._id,
      deviceName: session.deviceName,
      deviceType: session.deviceType,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
    })),
  };
};

export const UpdateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
  };
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
  };
};

export const UpdateUserPassword = async (userId, newPassword) => {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const user = await User.findByIdAndUpdate(
    userId,
    { passwordHash },
    { new: true, runValidators: true },
  );
  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
  };
};
