import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Expense } from "../models/expense.models.js";

const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, description } = req.body;
  if (!amount || !category)
    throw new ApiError(400, "amount & category are required");

  if (Number(amount) <= 0)
    throw new ApiError(400, "amount must be greater than zero");

  const expense = await Expense.create({
    user: req.user._id,
    amount,
    category,
    description,
  });

  if (!expense)
    throw new ApiError(500, "Something went wrong while adding expenses");

  res
    .status(201)
    .json(new ApiResponse(201, "successfully added expense!", expense));
});

const updateExpense = asyncHandler(async (req, res) => {
  const { id: expense_id } = req.params;
  if (!expense_id) throw new ApiError(400, "Expense id is required");

  const { amount, category, description } = req.body;

  if (Number(amount) <= 0)
    throw new ApiError(400, "amount must be greater than zero");

  const expenseUpdate = await Expense.findOneAndUpdate(
    {
      _id: expense_id,
      user: req.user._id,
    },
    { $set: { amount, category, description } },
    { new: true }
  );
  if (!expenseUpdate)
    throw new ApiError(404, "Expense not found or user is unauthorized");
  res
    .status(200)
    .json(
      new ApiResponse(200, "Expense data updated successfully", expenseUpdate)
    );
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id: expense_id } = req.params;
  if (!expense_id) throw new ApiError(400, "Expense id is required");

  const expenseDelete = await Expense.findOneAndDelete({
    _id: expense_id,
    user: req.user._id,
  });
  if (!expenseDelete)
    throw new ApiError(404, "Expense not found or user is unauthorized");

  res.status(200).json(new ApiResponse(200, "Expense deleted successfully"));
});

const getExpense = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parent(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const dataQuery = { user: req.user._id };
  if (req.query.category) dataQuery.category = req.query.category;
  if (req.query.id) dataQuery._id = req.query.id;

  const expense = await Expense.find({ dataQuery })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalDocument = await Expense.countDocuments(expense);
  const totalPages = Math.ceil(totalDocument / limit);

  const data = {
    expense,
    pagination: {
      totalDocument,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
    },
  };

  res
    .status(200)
    .json(new ApiResponse(200, "Expenses fetched successfully", data));
});

const getExpenseById = asyncHandler(async (req, res) => {
  const { id: expense_id } = req.params;
  if (!expense_id) throw new ApiError(400, "Expense ID is required");

  const expense = await Expense.findOne({
    _id: expense_id,
    user: req.user._id,
  });
  if (!expense) {
    throw new ApiError(404, "Expense not found or unauthorized");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Expense fetched successfully", expense));
});

export { createExpense };
