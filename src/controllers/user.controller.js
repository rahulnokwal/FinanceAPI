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

  let user = await User.create({
    fullName,
    email,
    password,
    profile,
  });

  if (!user)
    throw new ApiError(500, "Something went wrong while registering the user!");

  const createdUser = user.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken;

  return res
    .status(201)
    .json(new ApiResponse(201, "user registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email & Password are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "Email not found!");
  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) throw new ApiError(400, "Invalid credentials");

  const { refreshToken, accessToken } = await generateTokens(user);

  const userData = user.toObject();
  delete userData.password;
  delete userData.refreshToken;
  console.log(userData);
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "user logged in successfully", userData));
});

const options = {
  secure: true,
  httpOnly: true,
};

const generateTokens = async (user) => {
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { refreshToken, accessToken };
};
export { registerUser, loginUser };
