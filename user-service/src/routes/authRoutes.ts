import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/refresh-token", AuthController.refreshToken);

export default authRouter;
