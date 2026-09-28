import * as userService from "../services/user.service.js";
import ExpressError from "../utlis/error.js";

export const getMe = async (req, res) => {
  const userId = req.auth.userId;
  const user = await userService.userDetails(userId);
  res.status(200).json({ success: true, data: user });
};

export const UpdateUser = async (req, res) => {
  const userId = req.auth.userId;
  const { name, bio } = req.body;
  const updatedUser = await userService.UpdateUser(userId, { name, bio });
  res.status(200).json({ success: true, data: updatedUser });
};

export const deleteUser = async (req, res) => {
  const userId = req.auth.userId;
  const deletedUser = await userService.deleteUser(userId);
  res.status(200).json({ success: true, data: deletedUser });
};

export const UpdateUserPassword = async (req, res) => {
  const userId = req.auth.userId;
  const { password } = req.body;
  const updatedUser = await userService.UpdateUserPassword(userId, password);
  res.status(200).json({ success: true, data: updatedUser });
};

export const uploadImage = async (req, res) => {
  const userId = req.auth.userId;
  if (!req.file || !req.file.path) {
    throw new ExpressError("Image file is required", 400);
  }
  const image = await userService.uploadImage(userId, req.file.path);
  res.status(200).json({ success: true, data: image });
};
