import express from "express";
import { connectDb } from "./src/config/db.js";
import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import todoRouter from "./src/routes/todo.route.js";
import epxressMiddleware from "./src/middleware/error.middleware.js";
import dotenv from "dotenv";
import ExpressError from "./src/utlis/error.js";
import { isLogin } from "./src/middleware/auth.middleware.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND, credentials: true }));

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

connectDb();

app.use("/api/auth", authRouter);
app.use("/api/user", isLogin, userRouter);
app.use("/api/todo", isLogin, todoRouter);

app.use((req, res, next) => {
  throw new ExpressError("Route not Found", 404);
});

app.use(epxressMiddleware);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
