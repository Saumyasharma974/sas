import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateToken from '../helper/token.js'

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  generateToken(res, user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, { id: user._id, name, email }, "User registered successfully"));
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  generateToken(res, user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { id: user._id, name: user.name, email }, "Logged in successfully"));
});
