import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";

const verifyAuth = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) throw new ApiError(400, "user is not authorized");
  const decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  const user = User.findById(decodeToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(400, "Invalid Access Token");
  req.user = user;
  next();
};

export default verifyAuth;
