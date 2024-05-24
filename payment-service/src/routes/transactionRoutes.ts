import { Router } from "express";
import TransactionController from "../controllers/TransactionController";
import { authMiddleware } from "../middleware";

const chargeRoutes = Router();

// @ts-ignore
chargeRoutes.post(
    "/charge",
    // @ts-ignore
    authMiddleware,
    TransactionController.charge
);

export default chargeRoutes;
