import express, { Express } from "express";
import transactionRoutes from "./routes/transactionRoutes";
import { errorConverter, errorHandler } from "./middleware";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(transactionRoutes);
app.use(errorConverter);
app.use(errorHandler);

export default app;
