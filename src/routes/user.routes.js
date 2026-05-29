import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshaccessToken,
  getCurrentUser,
  updateProfile,
  updateUserInfo,
  changePassword,
  forgetPassword,
} from "../controllers/user.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profile"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyAuth, logoutUser);
router.route("/refreshtokens").post(refreshaccessToken);
router.route("/current-user").get(verifyAuth, getCurrentUser);
router
  .route("/profile")
  .patch(verifyAuth, upload.single("profile"), updateProfile);
router.route("/info").patch(verifyAuth, updateUserInfo);
router.route("/change-password").post(verifyAuth, changePassword);
router.route("/forget-password").post(forgetPassword);

export default router;
