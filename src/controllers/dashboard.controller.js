import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Expense } from "../models/expense.models.js";

const getExpenseStats = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const now = new Date();
  const StartOfYear = new Date(now.getFullYear(), 0, 1);
  const StartOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const StartOfWeek = new Date(now);
  StartOfWeek.setDate(now.getDate() - now.getDay());
  StartOfWeek.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const expenseStats = await Expense.aggregate([
    {
      $match: {
        user,
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
        totalTransaction: { $sum: 1 },
        average: { $avg: "$amount" },
        maxSpent: { $max: "$amount" },
        minSpent: { $min: "$amount" },
        spentThisYear: {
          $sum: {
            $cond: {
              if: { $gte: ["$createdAt", StartOfYear] },
              then: "$amount",
              else: 0,
            },
          },
        },
        spentThisMonth: {
          $sum: {
            $cond: {
              if: { $gte: ["$createdAt", StartOfMonth] },
              then: "$amount",
              else: 0,
            },
          },
        },
        spentThisWeek: {
          $sum: {
            $cond: {
              if: { $gte: ["$createdAt", StartOfWeek] },
              then: "$amount",
              else: 0,
            },
          },
        },
        spentToday: {
          $sum: {
            $cond: {
              if: { $gte: ["$createdAt", today] },
              then: "$amount",
              else: 0,
            },
          },
        },
      },
    },
  ]);

  const stats = expenseStats[0] || {
    totalSpent: 0,
    totalTransaction: 0,
    average: 0,
    maxSpent: 0,
    minSpent: 0,
    spentThisYear: 0,
    spentThisMonth: 0,
    spentThisWeek: 0,
    spentToday: 0,
  };

  res
    .status(200)
    .json(new ApiResponse(200, "dashboard data fetched successfully"), stats);
});

const getCategoryChartData = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const chartStats = await Expense.aggregate([
    {
      $match: { user },
    },
    {
      $group: {
        _id: category,
        spentOnCategory: { $sum: "$amount" },
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "category wisr data fetched successfully",
        chartStats
      )
    );
});

export { getExpenseStats, getCategoryChartData };
