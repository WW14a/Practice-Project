import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken } from "../utlis/token.js";

export const createUser = async (userData) => {
  const { name, email, password, bio } = userData;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash, bio });
  await user.save();
  return user;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }
  const passowrdMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passowrdMatch) {
    throw new Error("Invalid password");
  }
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { returnDocument: "after", runValidators: true },
  );

  return {
    id: user._id,
    accessToken,
    refreshToken,
    data: {
      name: user.name,
      email: user.email,
      bio: user.bio,
    },
  };
};

export const logout = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { returnDocument: "after", runValidators: true },
  );
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user._id,
  };
};
