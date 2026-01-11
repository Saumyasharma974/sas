// middlewares/checkCredits.js
import { ApiError } from "../utils/ApiError.js";

import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkCredits = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.credits < 20) {
    throw new ApiError(403, "Insufficient credits. Minimum 20 credits required per request.");
  }

  next();
});
