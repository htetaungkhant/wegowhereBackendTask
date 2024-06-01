import express, { Express } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import { errorConverter, errorHandler } from "./middleware";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authRouter);
app.use(userRouter);
app.use(errorConverter);
app.use(errorHandler);

export default app;
