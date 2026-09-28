import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { generateRefreshToken, generateToken } from "../utlis/token.js";
import Session from "../models/session.model.js";

export const createUser = async (userData) => {
  const { name, email, password, bio } = userData;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash, bio });
  await user.save();
  return user;
};

export const login = async (email, password, ipAddress, userAgent) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }
  const passowrdMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passowrdMatch) {
    throw new Error("Invalid password");
  }

  const sessionId = new mongoose.Types.ObjectId();
  const refreshToken = generateRefreshToken(user._id, sessionId);
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  const session = await Session.create({
    _id: sessionId,
    userId: user._id,
    refreshTokenHash,
    deviceName: "web",
    deviceType: "web",
    userAgent,
    ipAddress,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = generateToken(user._id, session._id);

  await User.findByIdAndUpdate(user._id, {
    returnDocument: "after",
    runValidators: true,
  });

  return {
    id: user._id,
    sessionId: session._id,
    accessToken,
    refreshToken,
    data: {
      name: user.name,
      email: user.email,
      bio: user.bio,
    },
  };
};

// export const logout = async (userId) => {
//   const user = await User.findByIdAndUpdate(
//     userId,
//     { refreshToken: null },
//     { returnDocument: "after", runValidators: true },
//   );
//   if (!user) {
//     throw new Error("User not found");
//   }
//   return {
//     id: user._id,
//   };
// };

export const revokedSession = async (sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }
  session.revokedAt = new Date();
  await session.save();
  return {
    id: session._id,
    message: "Session revoked successfully",
  };
};

export const logoutAll = async (userId) => {
  console.log("userId logout all session ", userId);
  const sessions = await Session.find({ userId, revokedAt: null });
  if (!sessions || sessions.length === 0) {
    throw new Error("No active sessions found for the user");
  }

  await Session.updateMany(
    { userId, revokedAt: null },
    { revokedAt: new Date() },
  );

  return {
    id: userId,
    message: "All sessions revoked successfully",
  };
};
