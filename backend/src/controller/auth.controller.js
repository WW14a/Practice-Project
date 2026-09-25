import User from "../models/user.model.js";
import * as authService from "../services/auth.service.js";
import { generateToken } from "../utlis/token.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  await authService.createUser(req.body);
  res.status(201).json({ message: "User created successfully" });
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const result = await authService.login(email, password);

  res
    .status(200)
    .json({ success: true, message: "Login successful", data: result });
};

export const refreshToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_REFRESHED_SECRET);

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const newAccessToken = generateToken(user._id);
  res.status(200).json({
    id: user._id,
    accessToken: newAccessToken,
    refreshToken: user.refreshToken,
  });
};

export const Logout = async (req, res) => {
  const userId = req.user._id;
  const result = await authService.logout(userId);
  res
    .status(200)
    .json({ success: true, message: "Logout successful", data: result });
};
