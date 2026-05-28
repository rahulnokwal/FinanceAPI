import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import { createExpense } from "../controllers/expense.controller.js";

const router = Router();

router.route("/add-expenses").post(verifyAuth, createExpense);
export default router;
