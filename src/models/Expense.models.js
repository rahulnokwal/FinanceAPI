import mongoose from "mongoose";

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
export const Expense = mongoose.model("Expense", expenseSchema);
