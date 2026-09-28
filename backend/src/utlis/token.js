import jwt from "jsonwebtoken";

export const generateToken = (user, session) => {
  const token = jwt.sign(
    { userId: user.toString(), sessionId: session.toString(), type: "access" },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  return token;
};

export const generateRefreshToken = (user, session) => {
  const token = jwt.sign(
    { userId: user.toString(), sessionId: session.toString(), type: "refresh" },
    process.env.JWT_REFRESHED_SECRET,
    {
      expiresIn: process.env.JWT_REFRESHED_EXPIRES_IN,
    },
  );

  return token;
};
