// controllers/purchaseCreditController.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import userModel from "../models/userModel.js";

// Fake Purchase Credits Controller with manual payment simulation
export const purchaseCredits = asyncHandler(async (req, res) => {
  const { email, credits, paymentStatus } = req.body;

  if (!email || !credits) {
    throw new ApiError(400, "Email and credits are required");
  }

  if (!paymentStatus) {
    throw new ApiError(400, "Payment status is required (success/failure)");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Fake Transaction Id
  const fakeTransactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Check payment simulation
  if (paymentStatus !== "success") {
    return res.status(400).json(
      new ApiResponse(400, {
        transactionId: fakeTransactionId,
        purchasedCredits: 0
      }, "Payment failed! No credits added.")
    );
  }

  // If success, add credits
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
