import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import uploadProfile from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (
    [fullName, email, password].some(
      (field) => field === undefined || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const isUserExisted = await User.findOne({ email });
  if (isUserExisted) throw new ApiError(400, "User Already exists.");

  const profilePath = req.file?.path;
  if (!profilePath) throw new ApiError(400, "Profile Photo is required.");
  const profile = await uploadProfile(profilePath);
  if (!profile) throw new ApiError(500, "Profile upload failed!");

  const user = await User.create({
    fullName,
    email,
    password,
    profile,
  });

  const isUserCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!isUserCreated)
    throw new ApiError(500, "Something went wrong while registering the user!");

  return res
    .status(201)
    .json(new ApiResponse(201, "user registered successfully", isUserCreated));
});

export { registerUser };
