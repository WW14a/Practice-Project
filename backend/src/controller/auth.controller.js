import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import * as authService from "../services/auth.service.js";
import { generateRefreshToken, generateToken } from "../utlis/token.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  await authService.createUser(req.body);
  res.status(201).json({ message: "User created successfully" });
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userAgent = req.headers["user-agent"] || "unknown";
  const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
  const result = await authService.login(email, password, ipAddress, userAgent);

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

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESHED_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  if (decoded.type !== "refresh") {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = await Session.findById(decoded.sessionId);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (session.revokedAt || session.expiresAt < new Date()) {
    return res.status(401).json({
      message: session.revokedAt ? "Session revoked" : "Session expired",
    });
  }

  const refreshTokenMatch = await bcrypt.compare(
    token,
    session.refreshTokenHash,
  );
  if (!refreshTokenMatch) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const newAccessToken = generateToken(user._id, session._id);
  const newRefreshToken = generateRefreshToken(user._id, session._id);

  session.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
  session.lastUsedAt = new Date();
  await session.save();

  res.status(200).json({
    id: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

export const Logout = async (req, res) => {
  const sessionId = req.auth.sessionId;
  const result = await authService.revokedSession(sessionId);
  res
    .status(200)
    .json({ success: true, message: "Logout successful", data: result });
};

export const LogoutAll = async (req, res) => {
  const userId = req.auth.userId;
  const result = await authService.logoutAll(userId);
  res
    .status(200)
    .json({ success: true, message: "Logout successful", data: result });
};
