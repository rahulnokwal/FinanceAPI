import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profile"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyAuth, logoutUser);

export default router;
