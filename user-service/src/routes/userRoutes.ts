import { Router } from "express";
import { authMiddleware } from "../middleware";
import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.get(
    "/get-all-users", 
    // @ts-ignore
    authMiddleware, 
    UserController.getAllUsers
);

export default userRouter;
