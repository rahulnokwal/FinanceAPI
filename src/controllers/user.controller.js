import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import uploadProfile from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const options = {
  secure: true,
  httpOnly: true,
  sameSite: "strict",
};

const generateTokens = async (user) => {
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { refreshToken, accessToken };
};

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
  if (!user) throw new ApiError(400, "Invalid email or password");
  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) throw new ApiError(400, "Invalid email or password");

  const { refreshToken, accessToken } = await generateTokens(user);

  const userData = user.toObject();
  delete userData.password;
  delete userData.refreshToken;

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "user logged in successfully", userData));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user logout successfully"));
});

const refreshaccessToken = asyncHandler(async (req, res) => {
  const userRefreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!userRefreshToken) throw new ApiError(401, "unauthorized access");

  let decodeToken;
  try {
    decodeToken = jwt.verify(
      userRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodeToken?._id);
  if (!user) throw new ApiError(401, "Invalid refresh token");

  if (userRefreshToken !== user.refreshToken)
    throw new ApiError(401, "Refresh token expired");
  const { accessToken, refreshToken } = await generateTokens(user);

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "Tokens refreshed successfully", {
        accessToken,
        refreshToken,
      })
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "user fetched successfully", req.user));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profilePath = req.file?.path;
  if (!profilePath) throw new ApiError(400, "Profile not found!");
  const upload = await uploadProfile(profilePath);
  if (!upload) throw new ApiError(500, "Error uploading profile!");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { profile: upload.url },
    },
    { new: true }
  ).select("-password -refreshToken");
  if (!user) throw new ApiError(500, "Something went wrong updating profile");
  return res
    .status(201)
    .json(new ApiResponse(200, "Profile updated successfully", user));
});

const updateUserInfo = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName && !email) throw new ApiError(400, "All fileds are required");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email } },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, "User data changed successfully", user));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new ApiError(400, "All fields are required");

  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(400, "Invalid password");
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}));
});

const forgetPassword = asyncHandler(async (req, res) => {
  // will add later
});

export { registerUser, loginUser, logoutUser, refreshaccessToken };
