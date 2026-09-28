import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";

export const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== "access") {
        return res.status(401).json({
          message: "Invalid access token",
        });
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await Session.findById(decoded.sessionId);
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return res.status(401).json({
        message: !session
          ? "Unauthorized"
          : session.revokedAt
            ? "Session revoked"
            : "Session expired",
      });
    }

    req.auth = {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
    };
    next();
  } catch (error) {
    next(error);
  }
};
