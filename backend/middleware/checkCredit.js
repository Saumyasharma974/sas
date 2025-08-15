// middlewares/checkCredits.js
import { ApiError } from "../utils/ApiError.js";

import User from "../models/userModel.js";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkCredits = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  
  if (!user || user.credits <= 0) {
    throw new ApiError(403, "Not enough credits. Please purchase more.");
  }

  next();
});
