import mongoose from "mongoose";

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },
  passwordHash: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
    required: [true, "Password is required"],
  },
  bio: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
