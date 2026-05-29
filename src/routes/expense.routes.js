import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpense,
  getExpenseById,
} from "../controllers/expense.controller.js";

const router = Router();
router.use(verifyAuth);
router.route("/add-expenses").post(createExpense);
router.route("/update-expense/:id").patch(updateExpense);
router.route("/delete-expense/:id").delete(deleteExpense);
router.route("/get-expenses").get(getExpense);
router.route("/get-expense/:id").get(getExpenseById);
export default router;
