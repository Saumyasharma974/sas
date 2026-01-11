import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const restrictToPremium = asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.isPremium) {
        throw new ApiError(403, "This feature is available only for Premium users. Please upgrade.");
    }
    next();
});
