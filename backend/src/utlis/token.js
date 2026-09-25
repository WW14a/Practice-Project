import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ id: user.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1minutes",
  });
  return token;
};

export const generateRefreshToken = (user) => {
  const token = jwt.sign(
    { id: user.toString() },
    process.env.JWT_REFRESHED_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return token;
};
