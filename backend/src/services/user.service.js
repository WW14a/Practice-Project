import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const userDetails = async (id) => {
  const user = await User.findById(id);
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
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
