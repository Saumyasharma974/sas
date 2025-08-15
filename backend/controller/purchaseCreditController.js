// controllers/purchaseCreditController.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import userModel from "../models/userModel.js";

// Fake Purchase Credits Controller
export const purchaseCredits = asyncHandler(async (req, res) => {
  const { email, credits } = req.body;

  if (!email || !credits) {
    throw new ApiError(400, "Email and credits are required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Simulate a payment success
  const fakeTransactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Add credits
  user.credits = (user.credits || 0) + Number(credits);
  await user.save();

  res.status(200).json(
    new ApiResponse(200, {
      credits: user.credits,
      transactionId: fakeTransactionId,
      purchasedCredits: credits
    }, "Credits purchased successfully")
  );
});
