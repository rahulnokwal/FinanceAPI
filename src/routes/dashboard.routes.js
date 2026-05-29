import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import {
  getExpenseStats,
  getCategoryChartData,
} from "../controllers/dashboard.controller.js";

const router = Router();
router.use(verifyAuth);
router.route("/stats").get(getExpenseStats);
router.route("/category-chart").get(getCategoryChartData);
export default router;
